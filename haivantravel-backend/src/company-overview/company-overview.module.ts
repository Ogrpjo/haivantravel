import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyOverview } from './company-overview.entity';
import { CompanyOverviewController } from './company-overview.controller';
import { CompanyOverviewService } from './company-overview.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOverview])],
  controllers: [CompanyOverviewController],
  providers: [CompanyOverviewService],
  exports: [CompanyOverviewService],
})
export class CompanyOverviewModule {}
