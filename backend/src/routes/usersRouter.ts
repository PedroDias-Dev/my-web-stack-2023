import { publicProcedure, router } from "../trpc";

const userRouter = router({
  userList: publicProcedure.query(async () => {
    const users = [] as any[];

    return users;
  }),
});

export default userRouter;
