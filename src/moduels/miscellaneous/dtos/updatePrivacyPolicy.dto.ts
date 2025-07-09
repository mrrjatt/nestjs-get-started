import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePrivacyPolicyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly heading: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly content: string;
}
