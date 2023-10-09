import { errorFormatter } from '@middlewares/error';
import { initTRPC } from '@trpc/server';
import fastifyPassport from '@fastify/passport';

import { IContext } from './context';

export const t = initTRPC.context<IContext>().create({
  errorFormatter
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const user = await fastifyPassport.authenticate('token', { authInfo: false }).bind(ctx.req as any, ctx.res as any);

  console.log(user);

  return next();
});

export const authenticatedProcedure = t.procedure.use(isAuthenticated);
