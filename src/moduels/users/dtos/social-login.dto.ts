import { AUTH_PROVIDERS } from '../../../helpers/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  readonly accessToken: string;

  @IsEnum(AUTH_PROVIDERS)
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string' })
  readonly provider: string;
}
