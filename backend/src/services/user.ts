import { db } from '@config/db';
import { users } from '@models/user';
import * as bcrypt from 'bcrypt';

interface UserReq {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

interface UserRes {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export class UserService {
  public async usersList() {
    const result = await db.select().from(users);

    return result;
  }

  public async usersInsert({ fullName, email, password, phone }: UserReq): Promise<UserRes> {
    const passwordHash = bcrypt.hashSync(password, 10);

    const result = await db
      .insert(users)
      .values({
        fullName,
        email,
        passwordHash,
        phone
      })
      .returning();

    return {
      id: result[0].id,
      fullName,
      email,
      phone
    };
  }
}
