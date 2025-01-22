import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDTO {
  @IsString()
  @ApiProperty({
    default: 'test',
  })
  @IsNotEmpty({
    message: 'Username tidak boleh kosong',
  })
  username: string;

  @IsString()
  @ApiProperty({
    default: 'test123',
  })
  @IsNotEmpty({
    message: 'Password tidak boleh kosong',
  })
  password: string;
}
