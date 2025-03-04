import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ResponseModel } from '../helpers/response.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../helpers/decorators/global.decorator';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto';
import { SocialLoginDto } from '../dtos/social-login.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { DeviceTokenDto } from '../dtos/deviceToken.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: LoginDto): Promise<ResponseModel> {
    console.log('reached in controller')
    const response = await this.authService.signIn(body);
    return new ResponseModel(true, response, 'logged in successfully', null);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const response = await this.authService.register(body);
    return new ResponseModel(
      true,
      response,
      'We have sent you an otp to your email please verify your accout',
      null,
    );
  }
  @Post('verify-account-otp')
  async accountVerifyOtp(@Body() body: VerifyOtpDto): Promise<ResponseModel> {
    const response = await this.authService.verifyOtp(body);

    return response
      ? new ResponseModel(
        true,
        response,
        'Congratulations! your account is now verified.',
        null,
      )
      : new ResponseModel(true, response, 'Something went Wrong', response);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('profile')
  async profile(@GetUser() user: User) {
    const response = user;
    return new ResponseModel(
      true,
      response,
      'Profile found successfully',
      null,
    );
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('profile')
  async updateProfile(@GetUser() user: User, @Body() body: UpdateUserDto) {
    const response = await this.authService.updateUser(body, user.id);
    return new ResponseModel(
      true,
      response,
      'Profile Updated successfully',
      null,
    );
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('create-update/device/token')
  async creatUpdateDeviceToken(@GetUser() user: User, @Body() body: DeviceTokenDto) {
    const response = await this.authService.createUpdateDeviceToken(body, user.id);
    return new ResponseModel(
      true,
      response.data,
      response.message,
      null,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('device/:id')
  async deleteDeviceToken(@GetUser() user: User, @Param('id') deviceId: string) {
    const response = await this.authService.removeDevice(deviceId, user.id);
    if (response) {
      return new ResponseModel(
        true,
        response,
        'Device deleted Successfully',
        null,
      );
    } else {
      throw new BadRequestException('Device was not successfully Deleted!')
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('change-password')
  async changePassword(@GetUser() user: User, @Body() body: ChangePasswordDto) {
    const response = await this.authService.changePassword(body, user);
    return new ResponseModel(
      true,
      response,
      'Password Updated successfully',
      null,
    );
  }
  @Post('send-forget-email')
  async forgotPasswordSendEmail(
    @Body() body: ForgotPasswordDto,
  ): Promise<ResponseModel> {
    const response = await this.authService.createUserOtp(body);

    return response
      ? new ResponseModel(
        true,
        response,
        'Otp has been sent to you email please check your mailbox make to sure to check spam in case you do not find the email.',
        null,
      )
      : new ResponseModel(true, response, 'Something went Wrong', response);
  }
  @Post('verify-forget-otp')
  async forgotPasswordVerifyOtp(
    @Body() body: VerifyOtpDto,
  ): Promise<ResponseModel> {
    const response = await this.authService.verifyOtp(body);

    return response
      ? new ResponseModel(
        true,
        response,
        'Otp has been successfully verified use this toke to reset you password. It will expire in two minutes.',
        null,
      )
      : new ResponseModel(true, response, 'Something went Wrong', response);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('reset-password')
  async resetUserPassword(
    @GetUser() user: User,
    @Body() body: UpdatePasswordDto,
  ) {
    const response = await this.authService.updateUserPassword(body, user.id);
    return new ResponseModel(
      true,
      response,
      'Password Updated successfully',
      null,
    );
  }

  @Post('social-signup')
  @HttpCode(HttpStatus.OK)
  async googleSignUp(@Body() body: SocialLoginDto): Promise<ResponseModel> {
    const resp = await this.authService.socialSignUp(body);
    return new ResponseModel(true, resp, 'Logged In!', null);
  }

}
