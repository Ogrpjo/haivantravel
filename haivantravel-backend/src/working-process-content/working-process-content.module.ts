import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingProcessContent } from './working-process-content.entity';
import { WorkingProcessContentController } from './working-process-content.controller';
import { WorkingProcessContentService } from './working-process-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingProcessContent])],
  controllers: [WorkingProcessContentController],
  providers: [WorkingProcessContentService],
  exports: [WorkingProcessContentService],
})
export class WorkingProcessContentModule {}

