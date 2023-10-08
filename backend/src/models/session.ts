import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './user';

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  userAgent: varchar('user_agent', { length: 256 }),
  online: boolean('online'),
  expireAt: timestamp('expire_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export type Session = typeof sessions.$inferSelect;
