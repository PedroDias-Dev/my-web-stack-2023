import { UserService } from '@services/user';
import { z } from 'zod';

import { authenticatedProcedure, publicProcedure, router } from '../trpc';

const userService = new UserService();

const userRouter = router({
  usersList: authenticatedProcedure.query(async () => {
    const result = await userService.usersList();
    return result;
  }),
  usersInsert: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string().email(),
        password: z.string(),
        phone: z.string()
      })
    )
    .mutation(async opts => {
      const { input } = opts;

      const data = await userService.usersInsert(input);

      return {
        message: 'User created successfully!',
        data
      };
    })
});

export default userRouter;
