import { configDotenv } from 'dotenv';

import type { Config } from 'drizzle-kit';

configDotenv();

export default {
  schema: '../models/schema.ts',
  out: '../../drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || ''
  }
} satisfies Config;
