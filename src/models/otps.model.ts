import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Otp extends Model {
  @Column
  email: string;
  @Column
  otp: string;
}
