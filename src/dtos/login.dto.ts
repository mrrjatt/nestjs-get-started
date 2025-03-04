import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly password: string;
}
