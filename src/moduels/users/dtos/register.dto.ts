import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly name: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly username: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly phone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly countryCode: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly password: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly dob: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    required: false,
  })
  readonly weight: number;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly weightUnit: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    required: false,
  })
  readonly goalWeight: number;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly goalWeightUnit: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    required: false,
  })
  readonly height: number;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly heightUnit: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly image: string;
}
