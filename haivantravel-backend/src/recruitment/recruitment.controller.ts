import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { SaveRecruitmentDto } from './dto/save-recruitment.dto';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get()
  findOne() {
    return this.recruitmentService.findOne();
  }

  @Post()
  save(@Body() dto: SaveRecruitmentDto) {
    return this.recruitmentService.save(dto);
  }
}
