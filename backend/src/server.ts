import './auth/supertokens';
import 'module-alias/register';

import cors from '@fastify/cors';
import formDataPlugin from '@fastify/formbody';
import { logOnResponse } from '@middlewares/requestLogs';
import appRouter from '@routes/usersRouter';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { log } from '@utils/logger';
import { configDotenv } from 'dotenv';
import fastify from 'fastify';
import supertokens from 'supertokens-node';
import { errorHandler, plugin } from 'supertokens-node/framework/fastify';

import { createContext } from './context';

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

    await server.register(cors, {
      origin: 'http://localhost:5173',
      allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
      credentials: true
    });

    await server.register(formDataPlugin);
    await server.register(plugin);

    server.addHook('onResponse', (req, reply, done) => {
      logOnResponse(req, reply, done);
    });

    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter, createContext }
    });

    server.setErrorHandler(errorHandler());

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
