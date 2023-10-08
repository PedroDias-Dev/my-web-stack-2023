import { integer, jsonb, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './user';

export const requestLogs = pgTable('requestLogs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  ip: varchar('ip', { length: 10 }),
  hostname: varchar('hostname', { length: 256 }),
  url: varchar('url', { length: 256 }),
  body: jsonb('body'),
  statusCode: varchar('status_code', { length: 3 }),
  durationMs: varchar('duration_ms', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow()
});

export type RequestLogs = typeof requestLogs.$inferSelect;
