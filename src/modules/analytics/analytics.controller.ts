import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    Param,
    Query
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
  import { AnalyticsService } from './analytics.service';
  import { RolesGuard } from 'src/common/guards/roles.guard';
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
  
    @Post('/parent/date-range-summary')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('parent', 'admin')
    async getDateRangeAttendanceSummary(
      @Request() req,
      @Body() dateRange: { startDate: string; endDate: string },
    ) {
      return this.analyticsService.getDateRangeAttendanceSummary(
        req.user.id,
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
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
  