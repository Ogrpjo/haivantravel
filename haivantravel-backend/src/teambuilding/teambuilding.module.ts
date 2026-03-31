import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamBuilding } from './teambuilding.entity';
import { TeamBuildingController } from './teambuilding.controller';
import { TeamBuildingService } from './teambuilding.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamBuilding])],
  controllers: [TeamBuildingController],
  providers: [TeamBuildingService],
  exports: [TeamBuildingService],
})
export class TeamBuildingModule {}

