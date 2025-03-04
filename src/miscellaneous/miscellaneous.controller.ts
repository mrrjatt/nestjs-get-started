import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../helpers/decorators/roles.decorator';
import { EmailTemplates, Role } from '../helpers/constants';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../helpers/role.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseModel } from '../helpers/response.model';
import { PrivacyPolicyDto } from '../dtos/privacyPolicy.dto';
import { UpdatePrivacyPolicyDto } from '../dtos/updatePrivacyPolicy.dto';
import { ContactUsDto } from '../dtos/contactUs.dto';
import { SharedService } from '../shared/shared.service';

@Controller()
@ApiTags('Miscellaneous')
export class MiscellaneousController {
    constructor(
        private miscellanousService: MiscellaneousService,
        private configService: ConfigService,
        private readonly sharedService: SharedService,

    ) { }
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Post('privacy-policy')
    async addPrivacyPolicy(@Body() body: PrivacyPolicyDto): Promise<ResponseModel> {
        return new ResponseModel(
            true,
            await this.miscellanousService.create(body),
            'Privacy Policy created successfully!',
            null,
        );
    }
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Patch('privacy-policy/:id')
    async updatePrivacyPolicy(
        @Body() body: UpdatePrivacyPolicyDto,
        @Param('id') id: number,
    ): Promise<ResponseModel> {
        return new ResponseModel(
            true,
            await this.miscellanousService.update(body, id),
            'Privacy Policy updated successfully!',
            null,
        );
    }
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Delete('privacy-policy/:id')
    async deletePrivacyPolicy(@Param('id') id: number): Promise<ResponseModel> {
        const isDeleted = await this.miscellanousService.delete(id);
        return new ResponseModel(
            true,
            null,
            isDeleted
                ? 'Privacy Policy deleted successfully!'
                : 'Privacy Policy not deleted successfully!',
            null,
        );
    }

    @Get('privacy-policy')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async allPrivacyPolicy(
        @Query('offset') offset: string = '0', // Default offset to 1 if not provided
        @Query('limit') limit: string = this.configService.get<string>('MAX_RECORDS_PER_REQUEST', '10'),
    ) {
        return new ResponseModel(
            true,
            await this.miscellanousService.findAllPrivacyPolicy(parseInt(limit), parseInt(offset)),
            'Privacy Policy list!',
            null,
        );
    }
    @Post('contact-us')
    async contactUs(@Body() body: ContactUsDto) {
        await this.sharedService.addEmailToQueue({
            to: body.email,
            subject: 'Contact us Message!',
            template: EmailTemplates.CONTACT_US,
            context: {
                appName: this.configService.get<string>('APP_NAME'),
                name: body.name,
                message: body.message,
            },
        });
        return new ResponseModel(
            true,
            null,
            'We have received your message we will get back to you the soonest',
            null,
        );
    }
}
