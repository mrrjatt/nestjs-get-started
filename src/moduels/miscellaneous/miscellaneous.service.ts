import { BadRequestException, Injectable } from '@nestjs/common';
import { PrivacyPolicy } from './models/privacyPolicy.model';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class MiscellaneousService {
    constructor(
        @InjectModel(PrivacyPolicy)
        private privacyPolicyModel: typeof PrivacyPolicy,
    ) { }

    async create(body: any): Promise<PrivacyPolicy> {
        return await this.privacyPolicyModel.create(body);
    }
    async update(body: any, id: number): Promise<PrivacyPolicy> {
        await this.privacyPolicyModel.update(body, { where: { id } });
        return this.privacyPolicyModel.findOne({ where: { id } });
    }
    async delete(id: number): Promise<boolean> {
        const result = await this.privacyPolicyModel.destroy({ where: { id } });
        if (result === 0) {
            throw new BadRequestException(`Privacy Policy with ID ${id} not found`);
        }
        return result > 0 ? true : false;
    }
    async findAllPrivacyPolicy(limit?: number, offset?: number): Promise<{ count: number, offset: number, data: PrivacyPolicy[] }> {
        const _data = await this.privacyPolicyModel.findAndCountAll({
            limit,
            offset,
            distinct: true,
            order: [['createdAt', 'DESC']],

        });
        return { count: _data?.count, offset: offset || 0, data: _data?.rows };
    }
}
