import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';
import { IsEmailUserAlreadyExistConstraint } from '../helpers/validators/unique-email.decorator';
import { JwtService } from '@nestjs/jwt';
import { Otp } from '../models/otps.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialLogin } from '../models/socialLogin.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([Otp, SocialLogin]), SharedModule, UsersModule],
  providers: [AuthService, JwtService, IsEmailUserAlreadyExistConstraint],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
