import { db } from '@config/db';
import { users } from '@models/user';

import { publicProcedure, router } from '../trpc';

const userRouter = router({
  userList: publicProcedure.query(async () => {
    const result = await db.select().from(users);

    return result;
  })
});

export default userRouter;
