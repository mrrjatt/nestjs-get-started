import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { GloablProcessor } from './processors/global.processor';
import { User } from './models/user.model';
import { Otp } from './models/otps.model';

import { AdminSeederService } from './seeders/admin-seeder.service';
import { SocialLogin } from './models/socialLogin.model';
import { Device } from './models/devices.model';
import { Notification } from './models/notification.model';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationProcessor } from './processors/notification.processor';
import { FirebaseModule } from './firebase/firebase.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PrivacyPolicy } from './models/privacyPolicy.model';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'), // Use ConfigService to access environment variables
        port: configService.get<number>('DB_PORT'), // Use ConfigService to access environment variables
        username: configService.get<string>('DB_USER'), // Use ConfigService to access environment variables
        password: configService.get<string>('DB_PASS'), // Use ConfigService to access environment variables
        database: configService.get<string>('DB_NAME'), // Use ConfigService to access environment variables
        models: [
          User,
          Otp,
          SocialLogin,
          Device,
          Notification,
          PrivacyPolicy,
        ],
        autoLoadModels: true,
        synchronize: true,
        // alter: true,
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'), // Use ConfigService to access environment variables
          port: configService.get<number>('MAIL_PORT'), // Use ConfigService to access environment variables
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_EMAIL'), // Use ConfigService to access environment variables
            pass: configService.get<string>('MAIL_PASSWORD'), // Use ConfigService to access environment variables
          },
        },
        defaults: {},
        template: {
          dir: join(__dirname + './../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    SequelizeModule.forFeature([User]),
    AuthModule,
    UsersModule,
    SharedModule,
    NotificationsModule,
    FirebaseModule,
    MiscellaneousModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, GloablProcessor, NotificationProcessor, AdminSeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private adminSeederService: AdminSeederService) { }

  async onModuleInit() {
    await this.adminSeederService.seedAdmin();
  }

}
