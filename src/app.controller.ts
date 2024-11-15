import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './common/middlewares/guards/roles.guard';
import { JwtAuthGuard } from './common/middlewares/guards/jwt-auth.guard';
import { Roles } from './common/decorators/roles.decorator';
@Controller()
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
