import { DefaultErrorShape, TRPCError } from '@trpc/server';
import { log } from '@utils/logger';
import { ZodError } from 'zod';

export const errorFormatter = (opts: {
  error: TRPCError;
  type: 'query' | 'mutation' | 'subscription' | 'unknown';
  path: string | undefined;
  input: unknown;
  ctx: object | undefined;
  shape: DefaultErrorShape;
}) => {
  const { shape, error } = opts;

  const isInputValidationError = error.code === 'BAD_REQUEST' && error.cause instanceof ZodError;

  let message = error.message;
  if (isInputValidationError && error.cause) {
    message = JSON.parse(error.message)[0].message;
  }

  log('ERROR', error);

  delete shape.data.stack;

  const errorData = {
    ...shape,
    message,
    data: {
      ...shape.data,
      inputValidationError: isInputValidationError ? error.cause.flatten() : null
    }
  };

  return errorData;
};
