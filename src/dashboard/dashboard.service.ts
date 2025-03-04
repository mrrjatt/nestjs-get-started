import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../models/user.model';


@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User) private userModel: typeof User,


    ) { }

    private getDateRange(range: string): { startDate: Date, endDate: Date } {
        const endDate = new Date();
        const startDate = new Date();

        switch (range) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'two-weeks':
                startDate.setDate(endDate.getDate() - 14);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                throw new Error('Invalid date range');
        }

        return { startDate, endDate };
    }

    async getDashboardStats(range: string) {
        const { startDate, endDate } = this.getDateRange(range);

        const totalMembers = await this.userModel.count({
            where: {
                role: {
                    [Op.not]: 'admin'
                }
            }
        });

        const newUsers = await this.userModel.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
                role: {
                    [Op.not]: 'admin'
                }
            },
        });

        const blockedUsers = await this.userModel.count({
            where: {
                isBlocked: true,
                updatedAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
        });

        return {
            totalMembers,
            newUsers,
            blockedUsers,
        };
    }
}