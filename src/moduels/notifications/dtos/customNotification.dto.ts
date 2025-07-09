import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly userId: number;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'boolean',
  })
  readonly shouldNotSave: boolean;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly title: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly description: string;
}
