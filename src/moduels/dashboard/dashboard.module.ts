import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../users/models/user.model';

import { JwtService } from '@nestjs/jwt';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]), SharedModule
  ],
  providers: [DashboardService, JwtService],
  controllers: [DashboardController],
})
export class DashboardModule { }
