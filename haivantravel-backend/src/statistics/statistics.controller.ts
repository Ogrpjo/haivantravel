import { Controller, Get, Post, Body } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { SaveStatisticsDto } from './dto/save-statistics.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Post()
  saveAll(@Body() dto: SaveStatisticsDto) {
    return this.statisticsService.saveAll(dto.items);
  }
}
