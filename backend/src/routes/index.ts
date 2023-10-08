// @filename: routers/_app.ts
import { router } from 'trpc';

import userRouter from './usersRouter';

const appRouter = router({
  user: userRouter
});

export default appRouter;
