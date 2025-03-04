import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Op, literal } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async findAll(limit?: number, offset?: number): Promise<{ count: number, offset: number, users: User[] }> {
    console.log('limit -> ' + limit, 'offset -> ' + offset);
    const data = await this.userModel.findAndCountAll({
      where: {
        role: {
          [Op.not]: 'admin'
        },
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      distinct: true,
    });
    return { count: data?.count, offset: offset || 0, users: data?.rows };
  }

  async searchUsers(
    name: string,
    limit?: number,
    offset?: number
  ): Promise<{ count: number, offset: number, users: User[] }> {
    console.log('name received in api', name);

    // Define the where clause
    const whereClause: any = {
      role: {
        [Op.not]: 'admin'
      }
    };

    // Add the name filter if name is provided and not empty
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`
      };
    }

    const data = await this.userModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      distinct: true,
      order: [['createdAt', 'DESC']],
    });

    return { count: data?.count, offset: offset || 0, users: data?.rows };
  }


  async findOne(body): Promise<User> {
    console.log('reached in user service')
    return await this.userModel.scope('withPassword').findOne({
      where: {
        [Op.or]: [
          { email: body.emailOrUsername },
          { username: body.emailOrUsername },
        ],
      },
    });
  }

  async create(body): Promise<User> {
    const user = await this.userModel.create(body);
    return user;
  }
  async getProfile(body): Promise<User> {
    return this.userModel.findOne({
      where: {
        id: body.id,
      }
    });

  }
  async update(body, id): Promise<User> {
    // const { email, password} = body;
    await this.userModel.update(body, {
      where: {
        id: id,
      },
    });
    return this.userModel.findOne({
      where: {
        id: id,
      },
    });
  }


  async blockUnblock(id: number, isBlocked: boolean): Promise<boolean> {

    const userUpdated = await this.userModel.update({ isBlocked }, {
      where: {
        id: id,
      },
    });
    return userUpdated ? true : false;
  }

}
