import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProgressDto {
    @IsString()
    @ApiProperty({ type: 'string' })
    name: string;

    @IsNumber()
    @ApiProperty({ type: 'number' })
    current: number;

    @IsNumber()
    @ApiProperty({ type: 'number' })
    goal: number;

    @IsNumber()
    @ApiProperty({ type: 'number' })
    percentage: number;

    @IsString()
    @ApiProperty({ type: 'string' })
    unitName: string;

    @IsString()
    @ApiProperty({ type: 'string' })
    unitSymbol: string;
}
