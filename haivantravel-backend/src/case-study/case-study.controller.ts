import { Body, Controller, Get, Post } from '@nestjs/common';
import { CaseStudyService } from './case-study.service';
import { SaveCaseStudyDto } from './dto/save-case-study.dto';

@Controller('case-study')
export class CaseStudyController {
  constructor(private readonly caseStudyService: CaseStudyService) {}

  @Get()
  findOne() {
    return this.caseStudyService.findOne();
  }

  @Post()
  save(@Body() dto: SaveCaseStudyDto) {
    return this.caseStudyService.save(dto);
  }
}
