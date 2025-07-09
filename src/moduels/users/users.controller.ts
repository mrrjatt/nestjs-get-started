import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../helpers/constants';
import { Roles } from '../../helpers/decorators/roles.decorator';
import { RolesGuard } from '../../helpers/role.guard';
import { ConfigService } from '@nestjs/config';
import { ResponseModel } from '../../helpers/response.model';
import { GetUser } from '../../helpers/decorators/global.decorator';
import { User } from './models/user.model';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private configService: ConfigService,
    ) { }
    @UseGuards(AuthGuard())
    @Get()
    @ApiOperation({ summary: 'Admin and user api' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAllUsers(
        @Query('offset') offset: string = '0', // Default offset to 1 if not provided
        @Query('limit') limit: string = this.configService.get<string>('MAX_RECORDS_PER_REQUEST', '10'),
    ) {
        const users = await this.userService.findAll(parseInt(limit), parseInt(offset));
        return new ResponseModel(
            true,
            users,
            'Users list',
            null,
        );
    }
    @UseGuards(AuthGuard())
    @Get('search')
    @ApiOperation({ summary: 'Admin and user api' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Name' })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async searchUsers(
        @Query('name') name: string,
        @Query('offset') offset: string = '0', // Default offset to 1 if not provided
        @Query('limit') limit: string = this.configService.get<string>('MAX_RECORDS_PER_REQUEST', '10'),
    ) {
        const users = await this.userService.searchUsers(name, parseInt(limit), parseInt(offset));
        return new ResponseModel(
            true,
            users,
            'Users list',
            null,
        );
    }
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Admin and user api' })
    @Get(':id')
    async getUserDetails(@Param('id') id: number, @GetUser() me: User) {
        console.log('reached in user details')
        const user = await this.userService.getProfile({ id, isOtherUser: true, myId: me.id });
        return new ResponseModel(
            true,
            user,
            'Users details',
            null,
        );
    }
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Patch(':id/block')
    async blockUser(@Param('id') id: number) {
        const userGotBlocked = await this.userService.blockUnblock(id, true);
        return new ResponseModel(
            true,
            null,
            userGotBlocked ? 'User blocked succesfully!' : 'User could not blocked successfully!',
            null,
        );

    }
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Patch(':id/unblock')
    async unBlockUser(@Param('id') id: number) {
        const userGotBlocked = await this.userService.blockUnblock(id, false);
        return new ResponseModel(
            true,
            null,
            userGotBlocked ? 'User unblocked succesfully!' : 'User could not unblocked successfully!',
            null,
        );
    }

}
