import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/middlewares/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from 'src/common/middlewares/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('parent/children-attendance')
  @UseGuards(JwtAuthGuard)
  async getParentChildrenAttendance(@Request() req) {
    console.log('Controller received user:', req.user);
    const userId = req.user.id;
    console.log('Extracted userId:', userId);
    return this.analyticsService.getParentChildrenAttendance(userId);
  }

  @Get('date-range-summary')
  @UseGuards(JwtAuthGuard)
  async getDateRangeAttendanceSummary(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const userId = req.user.id;
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.analyticsService.getDateRangeAttendanceSummary(
      userId,
      start,
      end,
    );
  }

  @Get('class-summary/:classId')
  @Roles('teacher', 'admin')
  async getClassSummary(
    @Param('classId') classId: string,
    @Query('date') dateStr: string = new Date().toISOString(),
  ) {
    const date = new Date(dateStr);
    return this.analyticsService.getClassAttendanceSummary(classId, date);
  }
}
