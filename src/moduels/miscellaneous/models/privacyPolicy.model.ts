import { DataTypes } from 'sequelize';
import {
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
@Table
export class PrivacyPolicy extends Model {
  @Column({ type: DataTypes.TEXT })
  heading: string;
  @Column({ type: DataTypes.TEXT })
  content: string;
}
