
import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { Notification } from '../notifications/models/notification.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Notification]),
  ],
  providers: [FirebaseService, NotificationsService],
  exports: [FirebaseService],
})
export class FirebaseModule { }
