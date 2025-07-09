import { Module, forwardRef } from '@nestjs/common';
import { SharedService } from './shared.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stratigy';
import { UsersModule } from '../moduels/users/users.module';
import { BullModule } from '@nestjs/bull';
import { QueueNames } from '../helpers/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue(
      { name: QueueNames.EMAIL_QUEUE },
      { name: QueueNames.SMS_QUEUE },
    ),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Use ConfigService to get environment variables
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRED_IN'), // Use ConfigService to get environment variables
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [SharedService, JwtStrategy],
  exports: [SharedService, JwtStrategy, PassportModule],
})
export class SharedModule { }
