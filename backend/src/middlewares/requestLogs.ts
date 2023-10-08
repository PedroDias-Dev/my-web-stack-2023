import { db } from '@config/db';
import { requestLogs } from '@models/requestLog';
import { log } from '@utils/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

export const logOnResponse = async (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
  if (process.env.NODE_ENV === 'DEV') {
    log('INFO', {
      url: req.raw.url,
      statusCode: reply.raw.statusCode,
      durationMs: Number(reply.getResponseTime().toFixed(2))
    });
  }

  const reqBody: any = JSON.parse(req.body as string);

  if (reqBody.password) {
    reqBody.password = '********';
  }

  if (req) {
    await db.insert(requestLogs).values({
      ip: req.ip.toString() || null,
      hostname: req.hostname || null,
      userId: null,
      url: req.url,
      body: reqBody,
      statusCode: reply.statusCode.toString(),
      durationMs: Number(reply.getResponseTime().toFixed(2)).toString()
    });
  }

  done();
};
