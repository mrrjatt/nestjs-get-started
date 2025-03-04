import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReactionDto {
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly reaction: string;

}
