import { SessionService } from '@services/session';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

const sessionService = new SessionService();

const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        user_agent: z.string().optional()
      })
    )
    .mutation(async opts => {
      const { input } = opts;

      const data = await sessionService.login(input);

      return {
        message: 'Welcome!',
        data
      };
    }),
    // logout: 
});

export default userRouter;
