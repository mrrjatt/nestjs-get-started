import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { QueueNames } from '../helpers/constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MailInput } from './dto/send-mail.dto';
import { ConfigService } from '@nestjs/config';
import { Notification } from '../models/notification.model';

@Injectable()
export class SharedService {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    private readonly mailService: MailerService,
    @InjectQueue(QueueNames.EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(QueueNames.SMS_QUEUE) private readonly smsQueue: Queue,
    private readonly configService: ConfigService,
  ) { }

  generateVerificationCode() {
    const min = 1000;
    const max = 9999;
    return this.configService.get<string>('NODE_ENV') == 'development'
      ? '1234'
      : String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  async generatePasswordHash(password: string) {
    const salt = await bcrypt.genSalt(
      +this.configService.get<string>('SALT_ROUND'),
    );
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, hasedPassword: string) {
    return await bcrypt.compare(password, hasedPassword);
  }

  // generate Jwt Token
  async generateJwt(user: User, expireTime?: string) {
    try {
      const payload: JwtPayload = { id: user.id, name: user.name };
      if (expireTime) {
        return this.jwtService.sign(payload, { expiresIn: expireTime });
      }
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new BadRequestException('Unable to generate token');
    }
  }

  getBaseUrl(request: Request): string {
    const protocol = request.protocol;
    const hostname = request.headers.host;
    return `${protocol}://${hostname}`;
  }

  generateImagePath(baseUrl: string, path: string) {
    return baseUrl + '/' + path;
  }
  async addEmailToQueue(data: MailInput) {
    await this.emailQueue.add('sendEmail', data);
  }

  async sendEmail(data: MailInput) {
    try {
      await this.mailService.sendMail(data);
    } catch (error) {
      console.log(error);
    }
  }

  async createAdminNotifcation(sentBy: number, title: string, description: string, data: any, type: string) {
    const admin = await User.findOne({
      where: {
        role: 'admin'
      }
    });
    return await Notification.create({
      sentBy, title, description, data, receivedBy: admin.id, type
    })
  }
}
