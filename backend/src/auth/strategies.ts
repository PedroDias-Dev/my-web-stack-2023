import { db } from '@config/db';
import { users } from '@models/user';
const JWTStrategy = passportJWT.Strategy;
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import passportJWT from 'passport-jwt';
import { Strategy } from 'passport-local';

const cookieExtractor = (req: any) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['token'];
  }

  return jwt;
};

export const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
  },
  (jwtPayload, done) => {
    const { expiration } = jwtPayload;

    if (Date.now() > expiration) {
      done('Unauthorized', false);
    }

    done(null, jwtPayload);
  }
);

export const localLoginStrategy = new Strategy(async (username: string, password: string, done: any) => {
  const found_users = await db.select().from(users).where(eq(users.email, username));
  const user = found_users[0];

  if (!user) {
    return done(null, false);
  }

  if (user.passwordHash) {
    const correctPassword = bcrypt.compareSync(password, user.passwordHash);

    if (!correctPassword) {
      return done(null, false);
    }
  }

  return done(null, user);
});
