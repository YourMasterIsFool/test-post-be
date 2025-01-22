import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({
    message: 'comment boleh kosong',
  })
  @ApiProperty({
    default: 'test comment',
  })
  comment: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'post id tidak boleh kosong',
  })
  @ApiProperty({
    default: 2,
  })
  postId: number;
}
