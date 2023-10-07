import { db } from '@config/db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

console.log(process.env.DATABASE_URL);

migrate(db, { migrationsFolder: './src/db/migrations' })
  .then(() => {
    console.log('Migrations complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migrations failed!', err);
    process.exit(1);
  });
