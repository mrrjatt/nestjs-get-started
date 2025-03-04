import {
  Model,
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model'; // Assuming you have a User model defined

@Table
export class Notification extends Model {
  @ForeignKey(() => User)
  @Column
  sentBy: number;
  @BelongsTo(() => User, 'sentBy')
  sender: User;
  @ForeignKey(() => User)
  @Column
  receivedBy: number;
  @BelongsTo(() => User, 'receivedBy')
  receiver: User;
  @Column({ type: DataType.TEXT })
  notificationData: string;
  @Column
  title: string;
  @Column
  type: string;
  @Column({ type: DataType.TEXT })
  description: string;
  @Column({ defaultValue: false })
  isRead: boolean;
}
