import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CommunityPostReactionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly reaction: string;
}
