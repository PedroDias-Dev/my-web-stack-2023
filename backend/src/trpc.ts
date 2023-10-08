import { errorFormatter } from '@middlewares/error';
import { initTRPC, TRPCError } from '@trpc/server';

import { IContext } from './context';
import { getAuth } from '@clerk/fastify';

export const t = initTRPC.context<IContext>().create({
  errorFormatter
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: {
        userId: parseInt(userId)
      }
    }
  });
});

export const authenticatedProcedure = t.procedure.use(isAuthenticated);
