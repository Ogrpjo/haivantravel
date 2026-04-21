import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseStudy } from './case-study.entity';
import { SaveCaseStudyDto } from './dto/save-case-study.dto';
import { saveSingleRichText } from '../common/saveSingleRichText';

@Injectable()
export class CaseStudyService {
  constructor(
    @InjectRepository(CaseStudy)
    private readonly repo: Repository<CaseStudy>,
  ) {}

  async findOne(): Promise<CaseStudy | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveCaseStudyDto): Promise<CaseStudy> {
    return saveSingleRichText(this.repo, dto.content);
  }
}
