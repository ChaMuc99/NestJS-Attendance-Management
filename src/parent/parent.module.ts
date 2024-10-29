import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';

@Module({
  providers: [ParentService],
  controllers: [ParentController]
})
export class ParentModule {}
