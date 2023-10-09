import { errorFormatter } from '@middlewares/error';
import { initTRPC } from '@trpc/server';

import { IContext } from './context';

export const t = initTRPC.context<IContext>().create({
  errorFormatter
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  return next();
});

export const authenticatedProcedure = t.procedure.use(isAuthenticated);
