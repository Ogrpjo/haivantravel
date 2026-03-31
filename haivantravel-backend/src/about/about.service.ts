import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from './about.entity';
import { SaveAboutDto } from './dto/save-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly repo: Repository<About>,
  ) {}

  async findOne(): Promise<About | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveAboutDto): Promise<About> {
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
