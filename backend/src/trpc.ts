import { errorFormatter } from '@middlewares/error';
import { logOnRequest } from '@middlewares/requestLogs';
import { initTRPC, TRPCError } from '@trpc/server';
import Session from 'supertokens-node/recipe/session';

import { IContext } from './context';

export const t = initTRPC.context<IContext>().create({
  errorFormatter
});

const requestLogMiddleware = t.middleware(({ ctx, next }) => {
  logOnRequest(ctx.req, ctx.res);
  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure.use(requestLogMiddleware);
export const mergeRouters = t.mergeRouters;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const session = await Session.getSession(ctx.req, ctx.res);

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  logOnRequest(ctx.req, ctx.res, parseInt(session.getUserId()));

  return next({
    ctx: {
      session: {
        userId: session.getUserId()
      }
    }
  });
});

export const authenticatedProcedure = t.procedure.use(isAuthenticated);
