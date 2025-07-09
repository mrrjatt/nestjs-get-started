import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly name: string;
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly email: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly username: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly phone: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly countryCode: string;
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
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  readonly isAthleteProfileEnabled: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  readonly sendPushNotifications: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  readonly sendTextNotifications: boolean;
}
