import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReasonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly reason: string;
}
