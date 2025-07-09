import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
    example: 'admin@gmail.com',
  })
  readonly emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    example: '12345678',
  })
  readonly password: string;
}
