// @filename: routers/_app.ts
import { mergeRouters } from '../trpc';
import userRouter from './usersRouter';

const appRouter = mergeRouters(userRouter);

export default appRouter;
