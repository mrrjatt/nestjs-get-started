import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { SharedService } from '../shared/shared.service';
import { MailInput } from '../shared/dto/send-mail.dto';
import { QueueNames } from '../helpers/constants';

@Processor(QueueNames.EMAIL_QUEUE)
@Injectable()
export class GloablProcessor {
  constructor(private readonly sharedService: SharedService) {}

  @Process('sendEmail')
  async sendEmail(job: Job<MailInput>) {
    await this.sharedService.sendEmail(job.data);
  }

  // @Process('sendSms')
  // async sendSms(job: Job<SmsInput>) {
  //   await this.sharedService.sendSms(job.data);
  // }
}
