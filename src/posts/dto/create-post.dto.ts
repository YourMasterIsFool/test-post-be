import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({
    message: 'title tidak boleh kosong',
  })
  @ApiProperty({
    default: 'title',
    description: 'harap isi title post',
  })
  @IsString()
  title: string;

  @IsNotEmpty({
    message: 'title tidak boleh kosong',
  })
  @ApiProperty({
    default: 'description',
    description: 'harap isi description post',
  })
  @IsString()
  context: string;
}
