import * as bcrypt from 'bcrypt';

import { constant } from 'src/constant';

export async function hashedPassword(password: string): Promise<string> {
  // sald haschode password untuk encryption password
  const salt = await bcrypt.genSalt(10);

  const hashed_password = await bcrypt.hash(password, salt);

  return hashed_password;
}
