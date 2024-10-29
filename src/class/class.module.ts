import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';

@Module({
  providers: [ClassService],
  controllers: [ClassController]
})
export class ClassModule {}
