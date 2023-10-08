import 'module-alias/register';

import formDataPlugin from '@fastify/formbody';
import appRouter from '@routes/usersRouter';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { log } from '@utils/logger';
import { configDotenv } from 'dotenv';
import fastify from 'fastify';

import { createContext } from './context';
import { clerkPlugin } from '@clerk/fastify';
import { logOnRequest } from '@middlewares/requestLogs';

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

    server.register(clerkPlugin);

    await server.register(formDataPlugin);

    server.addHook('onResponse', (req, reply, done) => {
      logOnRequest(req, reply);
      done();
    });

    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter, createContext }
    });

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
