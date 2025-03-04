import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowerDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly followingId: number;
}
