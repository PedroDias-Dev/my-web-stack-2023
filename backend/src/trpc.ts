import { errorFormatter } from '@middlewares/error';
import { initTRPC, TRPCError } from '@trpc/server';
import Session from 'supertokens-node/recipe/session';

import { IContext } from './context';

export const t = initTRPC.context<IContext>().create({
  errorFormatter
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const session = await Session.getSession(ctx.req, ctx.res);

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: {
        userId: session.getUserId()
      }
    }
  });
});

export const authenticatedProcedure = t.procedure.use(isAuthenticated);
