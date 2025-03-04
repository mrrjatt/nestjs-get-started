import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContactUsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly message: string;
}
