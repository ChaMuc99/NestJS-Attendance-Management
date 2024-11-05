import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { Parent } from './entities/parent.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, User])],
  providers: [ParentService],
  controllers: [ParentController],
  exports: [ParentService],
})
export class ParentModule {}
