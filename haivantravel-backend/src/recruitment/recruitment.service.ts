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
      return this.repo.save(existing);
    }
    const entity = this.repo.create({ content: dto.content ?? null });
    return this.repo.save(entity);
  }
}
