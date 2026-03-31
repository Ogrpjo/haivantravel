import { Body, Controller, Get, Post } from '@nestjs/common';
import { GalaService } from './gala.service';
import { SaveGalaDto } from './dto/save-gala.dto';

@Controller('gala')
export class GalaController {
  constructor(private readonly galaService: GalaService) {}

  @Get()
  findOne() {
    return this.galaService.findOne();
  }

  @Post()
  save(@Body() dto: SaveGalaDto) {
    return this.galaService.save(dto);
  }
}

