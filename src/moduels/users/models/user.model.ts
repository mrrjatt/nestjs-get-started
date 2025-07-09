import { Exclude } from 'class-transformer';
import {
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  HasOne,
  Model,
  Scopes,
  ScopesOptions,
  Table,
  Unique,
} from 'sequelize-typescript';
import { SocialLogin } from './socialLogin.model';
import { Device } from './devices.model';
import { Notification } from '../../notifications/models/notification.model';

@Table
@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Scopes(() => ({
  withPassword: {
    attributes: {},
  } as ScopesOptions,
}))
export class User extends Model {
  @Column
  name: string;
  @Column
  businessName: string;
  @Unique
  @Column
  email: string;
  @Unique
  @Column
  username: string;
  @Unique
  @Column
  phone: string;
  @Column
  countryCode: string;
  @Column
  dob: string;
  @Column
  image: string;
  @Column
  @Exclude()
  password: string;
  @Column({ defaultValue: false })
  isVerified: boolean;
  @Column({ defaultValue: false })
  isBlocked: boolean;

  @HasMany(() => SocialLogin)
  socialLogin: SocialLogin[];

  @HasMany(() => Device, {
    onDelete: 'CASCADE',
    hooks: true,
  })

  devices: Device[];
  @HasMany(() => Notification, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  notifications: Notification[];

  @Column({ defaultValue: 'user' })
  role: string;

  @Column
  lastLoginAt: Date;
}
