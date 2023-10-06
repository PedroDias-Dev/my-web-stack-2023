import 'module-alias/register';

import appRouter from '@routes/usersRouter';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const server = createHTTPServer({
  router: appRouter
});

server.listen(3000);
