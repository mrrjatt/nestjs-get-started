import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class ReelDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly caption: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: 'number',
  })
  readonly latitude: number;
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: 'number',
  })
  readonly longitude: number;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly location: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly type: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly audience: string;
  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    isArray: true,
  })
  readonly flairs: [];
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  readonly mediaUrl: string;
}
