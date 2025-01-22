import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @ApiProperty({
    default: 'Comedy',
    description: 'isikan tag baru',
  })
  name: string;
}
