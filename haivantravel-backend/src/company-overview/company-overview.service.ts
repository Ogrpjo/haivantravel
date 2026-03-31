import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyOverview } from './company-overview.entity';

export interface SaveCompanyOverviewDto {
  title?: string | null;
  description1?: string | null;
  description2?: string | null;
  big_image_url?: string | null;
  small_image_url?: string | null;
}

@Injectable()
export class CompanyOverviewService {
  constructor(
    @InjectRepository(CompanyOverview)
    private readonly repo: Repository<CompanyOverview>,
  ) {}

  async findOne(): Promise<CompanyOverview | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveCompanyOverviewDto): Promise<CompanyOverview> {
    const existing = await this.repo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (existing) {
      if (dto.title !== undefined) existing.title = dto.title;
      if (dto.description1 !== undefined)
        existing.description1 = dto.description1;
      if (dto.description2 !== undefined)
        existing.description2 = dto.description2;
      if (dto.big_image_url !== undefined)
        existing.big_image_url = dto.big_image_url;
      if (dto.small_image_url !== undefined)
        existing.small_image_url = dto.small_image_url;
      return this.repo.save(existing);
    }
    const entity = this.repo.create({
      title: dto.title ?? null,
      description1: dto.description1 ?? null,
      description2: dto.description2 ?? null,
      big_image_url: dto.big_image_url ?? null,
      small_image_url: dto.small_image_url ?? null,
    });
    return this.repo.save(entity);
  }
}
