import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseStudy } from './case-study.entity';
import { CaseStudyController } from './case-study.controller';
import { CaseStudyService } from './case-study.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaseStudy])],
  controllers: [CaseStudyController],
  providers: [CaseStudyService],
  exports: [CaseStudyService],
})
export class CaseStudyModule {}
