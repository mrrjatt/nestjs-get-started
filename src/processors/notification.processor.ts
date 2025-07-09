import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { SharedService } from '../shared/shared.service';
import { JOB_NAMES, QueueNames } from '../helpers/constants';
import { FirebaseService } from '../moduels/firebase/firebase.service';

@Processor(QueueNames.NOTIFICATIONS_QUEUE)
@Injectable()
export class NotificationProcessor {
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly sharedService: SharedService
  ) { }

  @Process(JOB_NAMES.FOLLOWED)
  async followed(job: Job): Promise<void> {
    console.log('job data -----', job.data)
    const { sentBy, receivedBy, title, body, type, data, shouldNotSave } = job.data;
    try {
      await this.firebaseApp.sendNotification(sentBy, receivedBy, title, body, type, data, shouldNotSave);
    } catch (error) {
      console.error('unable to send notification', error.message);
    }
  }

  // @Process(JOB_NAMES.CARD_USED)
  // async cardUsed(job: Job): Promise<void> {
  //   const { user, title, body, type } = job.data;
  //   try {
  //     await this.firebaseApp.sendNotification(user, title, body, type);
  //   } catch (error) {
  //     console.error('unable to send notification', error.message);
  //   }
  // }

  // @Process(JOB_NAMES.CARD_SENT)
  // async cardSent(job: Job): Promise<void> {
  //   const { user, title, body, type } = job.data;
  //   try {
  //     await this.firebaseApp.sendNotification(user, title, body, type);
  //   } catch (error) {
  //     console.error('unable to send notification', error.message);
  //   }
  // }

  // @Process(JOB_NAMES.CARD_RECIEVED)
  // async cardRecieved(job: Job): Promise<void> {
  //   const { user, title, body, type } = job.data;
  //   try {
  //     await this.firebaseApp.sendNotification(user, title, body, type);
  //   } catch (error) {
  //     console.error('unable to send notification', error.message);
  //   }
  // }
}
