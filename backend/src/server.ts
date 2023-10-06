import { createHTTPServer } from "@trpc/server/adapters/standalone";
import appRouter from "./routes";

import "./lib/moduleAlias";

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
