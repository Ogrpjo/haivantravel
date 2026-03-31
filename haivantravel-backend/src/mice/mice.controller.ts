import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaveMiceDto } from './dto/save-mice.dto';
import { MiceService } from './mice.service';

@Controller('mice')
export class MiceController {
  constructor(private readonly miceService: MiceService) {}

  @Get()
  findOne() {
    return this.miceService.findOne();
  }

  @Post()
  save(@Body() dto: SaveMiceDto) {
    return this.miceService.save(dto);
  }
}

