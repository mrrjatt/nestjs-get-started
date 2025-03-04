import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import 'dotenv/config';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '../models/user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log('this error was thrown from jwt strategy');
    const { id } = payload;
    const user = await this.userService.getProfile({ id: id });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.isBlocked) {
      throw new UnauthorizedException('Your token is no more valid.');
    }

    return user;
  }
}
