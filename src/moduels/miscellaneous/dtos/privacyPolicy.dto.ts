import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PrivacyPolicyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly heading: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly content: string;
}
