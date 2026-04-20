import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceContent } from './experience-content.entity';
import { ExperienceContentController } from './experience-content.controller';
import { ExperienceContentService } from './experience-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceContent])],
  controllers: [ExperienceContentController],
  providers: [ExperienceContentService],
  exports: [ExperienceContentService],
})
export class ExperienceContentModule {}

