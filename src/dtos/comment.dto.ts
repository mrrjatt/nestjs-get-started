import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly comment: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly communityPostId: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'number',
  })
  readonly parentId: number;
}
