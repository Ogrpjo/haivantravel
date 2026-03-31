import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamBuildingService } from './teambuilding.service';
import { SaveTeamBuildingDto } from './dto/save-teambuilding.dto';

@Controller('teambuilding')
export class TeamBuildingController {
  constructor(private readonly teamBuildingService: TeamBuildingService) {}

  @Get()
  findOne() {
    return this.teamBuildingService.findOne();
  }

  @Post()
  save(@Body() dto: SaveTeamBuildingDto) {
    return this.teamBuildingService.save(dto);
  }
}

