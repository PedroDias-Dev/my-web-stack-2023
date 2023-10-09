import { Strategy } from 'passport-local';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import { db } from '@config/db';
import { users } from '@models/user';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import passportJWT from 'passport-jwt';
import { FastifyInstance } from 'fastify';
const JWTStrategy = passportJWT.Strategy;
import fastifyPassport from '@fastify/passport';
import { log } from '@utils/logger';

import jwt from 'jsonwebtoken';

const cookieExtractor = (req: any) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['token'];
  }

  return jwt;
};

export const setUpPassport = async (server: FastifyInstance) => {
  await server.register(fastifyCookie);
  await server.register(fastifySession, {
    secret: process.env.COOKIE_SECRET as string,
    cookie: {
      sameSite: 'none', //add
      secure: true, //add
      maxAge: 24 * 60 * 60 * 1000
    }
  });

  await server.register(fastifyPassport.initialize());
  await server.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    'token',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET
      },
      (jwtPayload, done) => {
        // const { expiration } = jwtPayload;

        // if (Date.now() > expiration) {
        //   done('Unauthorized', false);
        // }

        done(null, jwtPayload);
      }
    )
  );

  await fastifyPassport.use(
    'local',
    new Strategy(async (username: string, password: string, done: any) => {
      log('INFO', 'Authenticating user ' + username);
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

      console.log(user);

      return done(null, user);
    })
  );

  fastifyPassport.registerUserSerializer(async (user: any) => {
    console.log('serializing user ', user);
    return user.id;
  });

  fastifyPassport.registerUserDeserializer(async id => {
    console.log('deserializing user ', id);
    return db
      .select()
      .from(users)
      .where(eq(users.id, id as number));
  });

  await server.post(
    '/login',
    { preValidation: fastifyPassport.authenticate('local', { authInfo: true, session: true }) },
    async (req, res) => {
      if (req.user) {
        console.log(req.session);

        const user = req.user as any;

        const payload = {
          ...user,
          expiration: Date.now() + 25000000000
        };

        const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET as string);

        res.cookie('token', token, {
          httpOnly: true,
          secure: true
        });

        return JSON.stringify(req.user);
      }
    }
  );
  await server.get(
    '/admin',
    { preValidation: fastifyPassport.authenticate('token', { authInfo: false }) },
    async req => {
      console.log(req.cookies);
      if (req.user) {
        return JSON.stringify(req.user);
      }
    }
  );
};
