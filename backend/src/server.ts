import 'module-alias/register';

import appRouter from '@routes/usersRouter';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { log } from '@utils/logger';
import { configDotenv } from 'dotenv';

configDotenv();

const server = createHTTPServer({
  router: appRouter,
  async middleware(req, res, next) {
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    const path = req.url;
    const type = req.method;

    const successfull = result.statusMessage === 'OK';

    successfull
      ? log('OK request timing:', { path, type, durationMs })
      : log('Non-OK request timing', { path, type, durationMs });

    return result;
  }
});

server.listen(parseInt(process.env.PORT as string) || 3000);
console.log(`Server listening on port ${process.env.PORT || 3000}`);
