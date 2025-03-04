import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class BlockedReasonDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly blockedReason: string;
}