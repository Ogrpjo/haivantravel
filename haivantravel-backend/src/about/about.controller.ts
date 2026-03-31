import { Controller, Get, Post, Body } from '@nestjs/common';
import { AboutService } from './about.service';
import { SaveAboutDto } from './dto/save-about.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  findOne() {
    return this.aboutService.findOne();
  }

  @Post()
  save(@Body() dto: SaveAboutDto) {
    return this.aboutService.save(dto);
  }
}
