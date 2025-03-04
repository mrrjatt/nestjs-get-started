import { ApiProperty } from "@nestjs/swagger";

export class HidePostDto {
    @ApiProperty({ required: true, type: 'number' })
    readonly postId: number
}