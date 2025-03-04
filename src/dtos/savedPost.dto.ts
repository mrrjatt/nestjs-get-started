import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SavedPostDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly postId: number;
}
