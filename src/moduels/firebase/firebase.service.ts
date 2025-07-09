/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

// import { Job } from 'bull';
import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { Model } from 'sequelize';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/models/notification.model';
import { Device } from '../users/models/devices.model';
// import { response } from 'express';
// import { User } from '../schemas/user.schema';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;
  private readonly message: admin.messaging.Message;
  private readonly messaging: admin.messaging.Messaging;

  constructor(
    @InjectModel(User) private userModel: Model<User>,
    private readonly notificationService: NotificationsService,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {



    if (!admin.apps.length) {
      const firebaseConfig = require('../../../recon-213c3-firebase-adminsdk-fbsvc-5bf0490705.json');
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    } else {
      // If the app has already been initialized, use the existing app
      this.firebaseApp = admin.app();
    }
    this.messaging = this.firebaseApp.messaging();
  }

  isConnected(): boolean {
    return !!this.firebaseApp.name;
  }

  async sendNotification(
    sentBy: number,
    receivedBy: number,
    title: string,
    body: string,
    type: string,
    data?: object,
    shouldNotSave?: boolean,
  ): Promise<string> {
    console.error('should not save received in service', shouldNotSave)
    if (receivedBy == sentBy) {
      console.log('Can not send notifications to self!');
      return 'Can not send notifications to self!';

    }
    const receivedByUserFcm = await Device.findOne({
      where: {
        userId: receivedBy
      }
    });
    const userSettings = await User.findOne({
      where: {
        id: receivedBy
      }
    })
    if (receivedByUserFcm?.fcmToken) {

      const message = {
        token: receivedByUserFcm.fcmToken,
        notification: { title, body },
        data,
      } as TokenMessage;
      await this.messaging.send(message).then(async (response) => {
        console.log(response);
      });

      console.log("messages in sendNotifcation=> ", message)
    }
    try {
      if (!shouldNotSave) {
        await this.notificationService.createNotification({
          sentBy,
          receivedBy,
          title,
          description: body,
          data,
          type
        });
      }
      return 'ok';
    } catch (error) {
      throw new Error(error);
    }
  }

  // async sendBatchNotifications(messages: any) {
  //   try {
  //     for (const message of messages) {
  //       const user = message.user;
  //       const type = message.type;
  //       delete message.user;
  //       delete message.type;

  //       await this.messaging
  //         .send(message)
  //         .then(async (obj) => {
  //           message.user = user;
  //           message.type = type;
  //           await this.notificationService.createNotification(message);
  //         })
  //         .catch(async (error) => {
  //           message.user = user;
  //           message.type = type;
  //           await this.notificationService.createNotification(message);
  //           throw new Error(error.message);
  //         });
  //     }
  //   } catch (error) {
  //     throw new Error(
  //       'Failed to send batch notifications make sure user has fcm token',
  //     );
  //   }
  // }

  // async sendBulkNotifications(job: Job) {
  //   try {
  //     const payload = job.data;
  //     await this.messaging.sendEachForMulticast(payload).catch((error) => {
  //       console.log(error);
  //     });
  //   } catch (error) {
  //     throw new Error(
  //       'Failed to send batch notifications make sure user has fcm token',
  //     );
  //   }
  // }
}
