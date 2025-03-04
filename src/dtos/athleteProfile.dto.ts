import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProgressDto } from './progress.dto';

export class AthleteProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgressDto)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: ProgressDto,
    isArray: true,
  })
  readonly progress: ProgressDto[];
}
