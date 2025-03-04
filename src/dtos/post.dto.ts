import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class PostDto {
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
  readonly images: [];
  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    isArray: true,
  })
  readonly flairs: [];
  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'number',
    isArray: true,
  })
  readonly taggedPeopleIds: [];
}
