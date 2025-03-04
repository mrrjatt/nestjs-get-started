import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { SharedService } from '../shared/shared.service';
import { UpdateUserDto } from '../dtos/updateUser.dto';
// import { EmailTemplates } from '../helpers/constants';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';
import { Otp } from '../models/otps.model';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { SocialLogin } from '../models/socialLogin.model';
import { SocialLoginDto } from '../dtos/social-login.dto';
import { AUTH_PROVIDERS, EmailTemplates, Role, providerFieldNames } from '../helpers/constants';
import { HttpService } from '@nestjs/axios';
import { User } from '../models/user.model';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { DeviceTokenDto } from '../dtos/deviceToken.dto';
import { Device } from '../models/devices.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SocialLogin)
    private socialLoginModel: typeof SocialLogin,
    private usersService: UsersService,
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService,
    private httpService: HttpService,

  ) { }

  async signIn(body: LoginDto) {
    console.log('reached in auth service')

    const user = (await this.usersService.findOne(body))?.toJSON();
    const isMatch = user
      ? await this.sharedService.comparePasswords(body.password, user?.password)
      : false;
    if (!isMatch || !user) {
      throw new UnauthorizedException('Invalid Email or Password!');
    }
    if (user.isBlocked) {
      throw new UnauthorizedException('We are really sorry but your account has been blocked by. Please contact support to resolve the issue and reclaim your account.');
    }
    delete user.password;
    return {
      user,
      token: await this.sharedService.generateJwt(user),
    };
  }
  async changePassword(body: ChangePasswordDto, user: User) {
    console.log(user.email)

    const userFound = (await this.usersService.findOne({ emailOrUsername: user.email }))?.toJSON();
    const isMatch = userFound
      ? await this.sharedService.comparePasswords(body.oldPassword, userFound?.password)
      : false;
    if (!isMatch || !userFound) {
      throw new BadRequestException('Invalid Password!');
    }
    const hashedPass = await this.sharedService.generatePasswordHash(
      body.newPassword,
    );
    const userUpdated = await this.usersService.update({ password: hashedPass }, user.id);
    delete user.password;
    return {
      user: userUpdated,
      token: await this.sharedService.generateJwt(user),
    };
  }
  async register(body: RegisterDto) {
    const hashedPass = await this.sharedService.generatePasswordHash(
      body.password,
    );
    try {
      const otp = this.sharedService.generateVerificationCode();
      await this.sharedService.addEmailToQueue({
        to: body.email,
        subject: 'Confirm your account!',
        template: EmailTemplates.CONFIRM_ACCOUNT,
        context: {
          appName: this.configService.get<string>('APP_NAME'),
          otp,
        },
      });
      try {
        await Otp.create({
          otp: otp,
          email: body.email,
        });
      } catch (error) {
        return error;
      }
      const user = (
        await this.usersService.create({
          ...body,
          password: hashedPass,
        })
      )?.toJSON();
      delete user?.password;
      this.sharedService.createAdminNotifcation(user.id, 'New Member Joined', user.name + ' has just joined Yoked', user, 'New Member Joined')
      return {
        user,
        token: await this.sharedService.generateJwt(user),
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          Object.keys(error.fields)[0] + ' already exists',
        );
      }
      throw error;
    }
  }

  async profile(body: any) {
    const user = await this.usersService.getProfile(body);
    delete user.toJSON().password;
    return {
      user,
      token: await this.sharedService.generateJwt(user),
    };
  }

  async updateUser(body: UpdateUserDto, id: any) {
    try {
      if (body.hasOwnProperty('password')) {
        body['password'] = undefined;
      }
      const user = await this.usersService.update(body, id);
      delete user?.password;
      return {
        user,
        token: await this.sharedService.generateJwt(user),
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          Object.keys(error.fields)[0] + ' already exists',
        );
      }
      throw error;
    }
  }

  async createUpdateDeviceToken(body: DeviceTokenDto, id: number): (Promise<{ data: DeviceTokenDto, message: string }>) {
    const alreadyRegisteredDevice = await Device.findOne({
      where: {
        userId: id,
        deviceId: body.deviceId
      }
    });
    if (alreadyRegisteredDevice) {
      await Device.update(
        {
          fcmToken: body.fcmToken
        },
        {
          where: {
            userId: id,
            deviceId: body.deviceId
          }
        })
      const updateDevice = await Device.findOne({
        where: {
          userId: id,
          deviceId: body.deviceId
        }
      });
      return {
        data: updateDevice,
        message: 'Device Updated successfully',
      }
    } else {
      const device = await Device.create({
        userId: id,
        ...body
      });
      return {
        data: device,
        message: 'Device created successfully',
      }
    }
  }

  async removeDevice(deviceId: string, userId: number): Promise<boolean> {
    const device = await Device.findOne({
      where: { deviceId, userId },
    });
    if (device) {
      device.destroy();
      return true;
    } else {
      return false;
    }
  }

  async createUserOtp(body: ForgotPasswordDto) {
    const user = await this.usersService.findOne({
      emailOrUsername: body.email,
    });
    if (!user) {
      throw new BadRequestException('User Not Found!');
    }
    const otp = this.sharedService.generateVerificationCode();
    await this.sharedService.addEmailToQueue({
      to: body.email,
      subject: 'Confirm your account!',
      template: EmailTemplates.RESET_PASSWORD,
      context: {
        appName: this.configService.get<string>('APP_NAME'),
        otp,
      },
    });
    try {
      await Otp.create({
        otp: otp,
        email: body.email,
      });
      return true;
    } catch (error) {
      return error;
    }
  }
  async verifyOtp(body: VerifyOtpDto) {
    const user = await this.usersService.findOne({
      emailOrUsername: body.email,
    });
    if (!user) {
      throw new BadRequestException('User Not Found!');
    }
    const isValidOtp = await Otp.findOne({
      where: {
        ...body,
      },
    });
    console.log(isValidOtp);
    if (!isValidOtp) {
      throw new BadRequestException('oops Invalid otp');
    }
    try {
      await Otp.destroy({
        where: {
          ...body,
        },
      });
      user.update({ isVerified: true });
      user.password = undefined;
      return {
        user,
        token: await this.sharedService.generateJwt(user),
      };
    } catch (error) {
      return error;
    }
  }

  async updateUserPassword(body: UpdatePasswordDto, id: any) {
    try {
      const hashedPass = await this.sharedService.generatePasswordHash(
        body.password,
      );
      const user = await this.usersService.update({ password: hashedPass }, id);
      user.password = undefined;
      return {
        user,
        token: await this.sharedService.generateJwt(user, '1m'),
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async socialSignUp(body: SocialLoginDto) {
    const { accessToken, provider } = body;
    const userInfo = await this.getUserProfileFromProvider(
      accessToken,
      provider,
    );
    const providerFields = providerFieldNames[provider];
    let user = await User.findOne({
      where: {
        email: userInfo[providerFields.email],
      },
      include: [SocialLogin],
    });
    if (!user) {
      user = await this.saveSocialAuth(
        userInfo[providerFields.name],
        userInfo[providerFields.email],
        userInfo[providerFields.providerId],
        userInfo[providerFields.picture],
        provider,
      );
    } else {
      for (const i of user?.socialLogin) {
        if (
          !(
            i.provider === provider &&
            i.providerId === userInfo[providerFields.providerId]
          )
        ) {
          await SocialLogin.create({

            provider,
            providerId: userInfo[providerFields.providerId],
            user: { id: user.id },
          });
        }
      }
    }

    const token = await this.sharedService.generateJwt(user);
    delete user.password;
    delete user.socialLogin;
    return {
      user,
      token,
    };
  }

  async getUserProfileFromProvider(accessToken: string, provider: string) {
    let userInfo;
    if (provider === AUTH_PROVIDERS.GOOGLE) {
      userInfo = await this.fetchGoogleUserProfile(accessToken);
    } else if (provider === AUTH_PROVIDERS.FACEBOOK) {
      userInfo = await this.fetchFacebookUserProfile(accessToken);
    } else {
      throw new BadRequestException('Unsupported provider');
    }
    return userInfo;
  }


  async fetchFacebookUserProfile(accessToken: string) {
    try {
      const response = await this.httpService
        .get('https://graph.facebook.com/me', {
          params: {
            fields: 'id,name,email',
            access_token: accessToken,
          },
        })
        .toPromise();
      return response.data;
    } catch (error) {
      throw new BadRequestException(JSON.stringify(error));
    }
  }

  async fetchGoogleUserProfile(accessToken: string) {
    try {
      const response = await this.httpService
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          params: {
            access_token: accessToken,
          },
        })
        .toPromise();
      return response.data;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async saveSocialAuth(
    name: string,
    email: string,
    providerId: string,
    profile_pic: string,
    provider: string,
  ) {
    const user = await this.usersService.create({
      role: Role.User,
      isVerified: true,
      name,
      image: profile_pic,
      email,
    });
    await SocialLogin.create({
      provider,
      providerId,
      userId: user.id,
    });
    return user;
  }
}
