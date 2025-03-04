import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    timestamps: true,
})
export class SocialLogin extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    provider: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    providerId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

}
