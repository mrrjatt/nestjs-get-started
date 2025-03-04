import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';
import sequelize from 'sequelize';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification)
        private notificationModel: typeof Notification,
    ) { }

    async createNotification(body: any): Promise<Notification> {
        return await this.notificationModel.create(body);
    }
    async myNotifications(userId: number, limit?: number, offset?: number): Promise<{ count: number, offset: number, notifications: Notification[] }> {
        const data = await this.notificationModel.findAndCountAll({
            where: { receivedBy: userId },
            include: [
                {
                    model: User,
                    foreignKey: 'sentBy',
                    as: 'sender',
                    attributes: {
                        include: [
                            [
                                // Sub-query to determine if the authenticated user follows the sender
                                sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM Followers AS follower
                                WHERE follower.followerId = ${userId}
                                AND follower.followingId = sender.id
                            )`),
                                'isFollowed'
                            ]
                        ]
                    }
                }
            ],
            limit,
            offset,
            distinct: true,
            order: [['createdAt', 'DESC']],

        });
        const notifications = data.rows.map(notification => {
            const sender = notification.sender;
            const isFollowed = sender.dataValues.isFollowed > 0; // Convert count to boolean
            sender.dataValues.isFollowed = isFollowed; // Assign boolean value

            return {
                ...notification.dataValues,
                sender: {
                    ...sender.dataValues
                }
            };
        });
        return { count: data?.count, offset: offset || 0, notifications };
    }
    async markasRead(id: number): Promise<boolean> {
        const notificationRead = await this.notificationModel.update({ isRead: true }, {
            where: {
                id: id,
            },
        });
        return notificationRead ? true : false;
    }
    async markAllRead(id: number): Promise<boolean> {
        const notificationRead = await this.notificationModel.update({ isRead: true }, {
            where: {
                receivedBy: id,
            },
        });
        return notificationRead ? true : false;
    }

    async delete(id: number): Promise<number> {
        return await this.notificationModel.destroy({
            where: {
                id: id,
            },
        });
    }
}
