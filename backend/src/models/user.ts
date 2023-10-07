import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow()
});

export type User = typeof users.$inferSelect;
