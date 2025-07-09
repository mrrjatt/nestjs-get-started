import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly deviceId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  readonly fcmToken: string;
}
