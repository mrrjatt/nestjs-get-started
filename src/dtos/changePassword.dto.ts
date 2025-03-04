import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly newPassword: string;
}
