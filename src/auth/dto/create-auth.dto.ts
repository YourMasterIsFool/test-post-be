import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty({
    message: 'username tidak boleh kosong',
  })
  @ApiProperty({
    default: 'Test',
  })
  username: string;

  @IsString()
  @IsNotEmpty({
    message: 'password tidak boleh kosong',
  })
  @ApiProperty({
    default: 'test123',
  })
  password: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'role dibutuhkan',
  })
  @ApiProperty({
    default: 1,
  })
  roleId: number;

  @IsString()
  @ApiProperty({
    default: 'test',
  })
  @IsNotEmpty({
    message: 'nama tidak boleh kosong',
  })
  name: string;
}
