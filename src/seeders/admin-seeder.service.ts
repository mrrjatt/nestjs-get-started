/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class AdminSeederService {
    constructor(
        @InjectModel(User)
        private adminModel: typeof User,
        private readonly sharedService: SharedService,
    ) { }

    async seedAdmin(): Promise<void> {
        const existingAdmin = await this.adminModel.findOne({
            where: {
                role: 'admin'
            }
        });
        if (existingAdmin) {
            console.log('Admin already exists. Skipping seeding.');
            return;
        }

        await this.adminModel.create({
            email: 'admin@gmail.com',
            username: 'admin',
            password: await this.sharedService.generatePasswordHash(
                '12345678'
            ),
            role: 'admin',
            isVerified: true,
        });
        console.log('Admin seeded successfully.');
    }
}
