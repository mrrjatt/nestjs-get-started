import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CommunityPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly description: string;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    isArray: true,
  })
  readonly images: [];
}
