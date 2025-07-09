import { Module } from '@nestjs/common';
import { MiscellaneousController } from './miscellaneous.controller';
import { MiscellaneousService } from './miscellaneous.service';
import { SharedModule } from '../../shared/shared.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PrivacyPolicy } from './models/privacyPolicy.model';

@Module({
  imports: [SequelizeModule.forFeature([PrivacyPolicy]), SharedModule],
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService],
  exports: [MiscellaneousService]

})
export class MiscellaneousModule { }
