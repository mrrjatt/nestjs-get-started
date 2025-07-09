import {
  BelongsTo,
  Column,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import moment from 'moment';
import { User } from './user.model';

@Table
export class Device extends Model {
  @ForeignKey(() => User)
  @Column({
    onDelete: 'CASCADE',
  })
  userId: number;
  @BelongsTo(() => User)
  user: User;
  @Index
  @Column
  deviceId: string;
  @Index
  @Column
  fcmToken: string;
  get timeAgo(): string {
    return moment(this.createdAt).fromNow();
  }
}
