import { getAuth } from '@clerk/fastify';
import { db } from '@config/db';
import { requestLogs } from '@models/requestLog';
import { log } from '@utils/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

export const logOnRequest = async (req: FastifyRequest, reply: FastifyReply) => {
  if (process.env.NODE_ENV === 'DEV') {
    log('INFO', {
      url: req.raw.url,
      statusCode: reply.raw.statusCode,
      durationMs: Number(reply.getResponseTime().toFixed(2))
    });
  }

  const reqBody: any = req.body ? JSON.parse(req.body as string) : null;

  if (reqBody && reqBody.password) {
    reqBody.password = '********';
  }

  const { userId } = getAuth(req);

  if (req) {
    await db.insert(requestLogs).values({
      ip: req.ip.toString() || null,
      hostname: req.hostname || null,
      userId: userId ? parseInt(userId) : null,
      url: req.url,
      body: reqBody,
      statusCode: reply.statusCode.toString(),
      durationMs: Number(reply.getResponseTime().toFixed(2)).toString()
    });
  }
};
