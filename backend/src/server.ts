import 'module-alias/register';

import formDataPlugin from '@fastify/formbody';
import appRouter from '@routes/usersRouter';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { log } from '@utils/logger';
import { configDotenv } from 'dotenv';
import fastify from 'fastify';

import { createContext } from './context';
import { logOnRequest } from '@middlewares/requestLogs';
import { setUpPassport } from 'auth/passport';

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

    await setUpPassport(server);

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
