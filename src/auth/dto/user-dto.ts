import { Exclude } from 'class-transformer';

export class UserDTO {
  id: number;
  name: string;
  username: string;

  @Exclude()
  password: string;
}
