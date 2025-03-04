import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StoryLIkeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: 'number',
  })
  readonly storyId: number;
}
