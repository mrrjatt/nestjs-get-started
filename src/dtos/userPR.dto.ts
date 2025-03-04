import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReelPRDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly userId: number;
}
