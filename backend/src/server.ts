import 'module-alias/register';

import formDataPlugin from '@fastify/formbody';
import appRouter from '@routes/usersRouter';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { log } from '@utils/logger';
import { configDotenv } from 'dotenv';
import fastify from 'fastify';

import { createContext } from './context';
import { logOnRequest } from '@middlewares/requestLogs';
import fastifyPassport from '@fastify/passport';
import { Strategy } from 'passport-local';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import passport from 'passport';
import { db } from '@config/db';
import { users } from '@models/user';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

configDotenv();

(async () => {
  try {
    const server = await fastify({
      maxParamLength: 5000,
      logger: {
        redact: ['headers.authorization'],
        level: 'info'
      },
      disableRequestLogging: true
    });

    await server.register(import('@fastify/rate-limit'), {
      max: 50,
      timeWindow: '1 minute'
    });

    await server.register(fastifyCookie);
    await server.register(fastifySession, { secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
    await server.register(fastifyPassport.initialize());
    await server.register(fastifyPassport.secureSession());

    await fastifyPassport.use(
      'local-auth',
      new Strategy(async (username, password, done) => {
        log('INFO', 'Authenticating user ' + username);
        const found_users = await db.select().from(users).where(eq(users.email, username));
        const user = found_users[0];

        if (!user) {
          return done(null, false);
        }

        if (user.passwordHash) {
          const correctPassword = bcrypt.compareSync(password, user.passwordHash);

          if (!correctPassword) {
            return done(null, false);
          }
        }

        return done(null, user);
      })
    );

    passport.serializeUser(function (user, done) {
      done(null, 1);
    });

    passport.deserializeUser(async function (id, done) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id as number));

      done(null, user);
    });

    await server.register(formDataPlugin);

    server.addHook('onResponse', (req, reply, done) => {
      logOnRequest(req, reply);
      done();
    });

    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter, createContext }
    });

    await server.post(
      '/test/login',
      fastifyPassport.authenticate('local-auth', {
        successRedirect: '/auth/quiz',
        failureRedirect: '/auth/login'
      })
    );

    // create a curl request for the endpoint above
    // curl -X POST -d '{"query":"{\n  user(id: 1) {\n    id\n    name\n  }\n}"}' -H "Content-Type: application/json" http://localhost:3000/trpc

    await server.listen({ port: parseInt(process.env.PORT as string) || 3000 });
    log(`Server listening on port ${process.env.PORT || 3000}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// const server = createHTTPServer({
//   router: appRouter,
//   async middleware(req, res, next) {
//     const start = Date.now();
//     const result = await next();
//     const durationMs = Date.now() - start;

//     const path = req.url;
//     const type = req.method;

//     const successfull = result.statusMessage === 'OK';

//     successfull
//       ? log('OK request timing:', { path, type, durationMs })
//       : log('Non-OK request timing', { path, type, durationMs });

//     return result;
//   }
// });
