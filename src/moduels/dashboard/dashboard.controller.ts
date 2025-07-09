import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../helpers/constants';
import { Roles } from '../../helpers/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../helpers/role.guard';

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    @ApiOperation({ summary: 'Admin api' })
    @Get()
    async getDashboardStats(@Query('range') range: string) {
        if (!['week', 'two-weeks', 'month', 'year'].includes(range)) {
            throw new BadRequestException('Invalid range');
        }
        return this.dashboardService.getDashboardStats(range);
    }
}
