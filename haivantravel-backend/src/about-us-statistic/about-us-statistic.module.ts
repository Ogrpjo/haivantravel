import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutUsStatistic } from './about-us-statistic.entity';
import { AboutUsStatisticController } from './about-us-statistic.controller';
import { AboutUsStatisticService } from './about-us-statistic.service';

@Module({
  imports: [TypeOrmModule.forFeature([AboutUsStatistic])],
  controllers: [AboutUsStatisticController],
  providers: [AboutUsStatisticService],
  exports: [AboutUsStatisticService],
})
export class AboutUsStatisticModule {}
