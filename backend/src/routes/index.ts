// @filename: routers/_app.ts
import { router, publicProcedure, mergeRouters } from "../trpc";
import { z } from "zod";

import userRouter from "./usersRouter";

const appRouter = mergeRouters(userRouter);

export default appRouter;
