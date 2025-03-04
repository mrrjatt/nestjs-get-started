import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../helpers/decorators/global.decorator';
import { User } from '../models/user.model';
import { ResponseModel } from '../helpers/response.model';
import { CustomNotificationDto } from '../dtos/customNotification.dto';
import { Queue } from 'bull';
import { JOB_NAMES, QueueNames } from '../helpers/constants';
import { InjectQueue } from '@nestjs/bull';

@Controller()
@ApiTags('Notifications')
export class NotificationsController {
    constructor(
        private notificationService: NotificationsService,
        private configService: ConfigService,
        @InjectQueue(QueueNames.NOTIFICATIONS_QUEUE) private readonly notificationQueue: Queue,
    ) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('auth/notifications')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async getMyPosts(@GetUser() user: User,
        @Query('offset') offset: string = '0', // Default offset to 1 if not provided
        @Query('limit') limit: string = this.configService.get<string>('MAX_RECORDS_PER_REQUEST', '10'),
    ) {
        const response = await this.notificationService.myNotifications(user.id, parseInt(limit), parseInt(offset));
        return new ResponseModel(
            true,
            response,
            'Posts found for current user',
            null,
        );
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('notifications/custom')
    async sendCustomNotification(
        @GetUser() user: User,
        @Body() body: CustomNotificationDto,
    ) {
        const receivingUser = await User.findOne({
            where: {
                id: body.userId
            }
        })
        await this.notificationQueue.add(JOB_NAMES.FOLLOWED, {
            name: JOB_NAMES.FOLLOWED,
            type: 'custom',
            sentBy: user.id,
            receivedBy: body.userId,
            title: body.title,
            body: body.description,
            shouldNotSave: body.shouldNotSave,
        });
        if (!body.shouldNotSave) {
            await this.notificationService.createNotification({
                type: 'custom',
                sentBy: user.id,
                receivedBy: body.userId,
                title: body.title,
                body: body.description,
                data: null
            });
        }
        return new ResponseModel(
            true,
            { message: 'User Notified' },
            'Notfication send successfully',
            null,
        );
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Patch('notification/:id/read')
    async readNotifications(@Param('id') id: number) {
        const notificationGotRead = await this.notificationService.markasRead(id);
        return new ResponseModel(
            true,
            null,
            notificationGotRead ? 'Notification read succesfully!' : 'Notification not read successfully!',
            null,
        );

    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Patch('notification/read/all')
    async readAllNotifications(@GetUser() user: User) {
        const notificationGotRead = await this.notificationService.markAllRead(user.id);
        return new ResponseModel(
            true,
            null,
            notificationGotRead ? 'Notification read succesfully!' : 'Notification not read successfully!',
            null,
        );

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Delete('notification/:id')
    async deleteNotification(@Param('id') id: number) {
        try {
            const response = await this.notificationService.delete(id);
            if (response) {
                return new ResponseModel(
                    true,
                    response,
                    'Notification deleted Successfully',
                    null,
                );
            } else {
                return new ResponseModel(
                    true,
                    response,
                    'Notification was not successfully deleted',
                    null,
                );
            }
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Something went wrong',
                    error: error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error,
                },
            );
        }
    }
}
