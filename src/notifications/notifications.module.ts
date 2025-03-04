import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from '../models/notification.model';
import { SharedModule } from '../shared/shared.module';
import { QueueNames } from '../helpers/constants';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [SequelizeModule.forFeature([Notification]), SharedModule,
  BullModule.registerQueue({ name: QueueNames.NOTIFICATIONS_QUEUE })],
  exports: [NotificationsService],
  providers: [NotificationsService, JwtService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
