import { db } from '@config/db';
import { sessions } from '@models/session';
import { users } from '@models/user';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import jsonwebtoken from 'jsonwebtoken';

interface LoginReq {
  email: string;
  password: string;
  user_agent?: string;
}

interface LoginRes {
  token: string;
}

export class SessionService {
  public async login({ email, password, user_agent }: LoginReq): Promise<LoginRes> {
    const found_users = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash
      })
      .from(users)
      .where(eq(users.email, email));

    const user = found_users[0];

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    if (user.passwordHash) {
      const correctPassword = bcrypt.compareSync(password, user.passwordHash);

      if (!correctPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Incorrect password'
        });
      }
    }

    await db
      .insert(sessions)
      .values({
        online: true,
        userId: user.id,
        userAgent: user_agent
      })
      .returning();

    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email
      },
      'secret',
      { expiresIn: '1h' }
    );

    return {
      token
    };
  }
}
