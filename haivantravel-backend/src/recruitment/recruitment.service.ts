import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruitment } from './recruitment.entity';
import { SaveRecruitmentDto } from './dto/save-recruitment.dto';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Recruitment)
    private readonly repo: Repository<Recruitment>,
  ) {}

  async findOne(): Promise<Recruitment | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveRecruitmentDto): Promise<Recruitment> {
    const existing = await this.repo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (existing) {
      if (dto.content !== undefined) existing.content = dto.content ?? null;
      if (dto.html_content !== undefined) {
        existing.html_content = dto.html_content ?? null;
      }
      if (dto.css_content !== undefined) {
        existing.css_content = dto.css_content ?? null;
      }
      return this.repo.save(existing);
    }
    const entity = this.repo.create({
      content: dto.content ?? null,
      html_content: dto.html_content ?? null,
      css_content: dto.css_content ?? null,
    });
    return this.repo.save(entity);
  }
}
