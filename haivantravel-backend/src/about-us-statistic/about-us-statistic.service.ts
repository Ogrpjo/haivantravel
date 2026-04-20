import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutUsStatistic } from './about-us-statistic.entity';

export interface SaveAboutUsStatisticDto {
  number_1?: number;
  name_1?: string | null;
  number_2?: number;
  name_2?: string | null;
  number_3?: number;
  name_3?: string | null;
  number_4?: number;
  name_4?: string | null;
}

@Injectable()
export class AboutUsStatisticService {
  constructor(
    @InjectRepository(AboutUsStatistic)
    private readonly repo: Repository<AboutUsStatistic>,
  ) {}

  async findOne(): Promise<AboutUsStatistic | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveAboutUsStatisticDto): Promise<AboutUsStatistic> {
    const existing = await this.findOne();

    if (existing) {
      if (dto.number_1 !== undefined) existing.number_1 = dto.number_1;
      if (dto.name_1 !== undefined) existing.name_1 = dto.name_1;
      if (dto.number_2 !== undefined) existing.number_2 = dto.number_2;
      if (dto.name_2 !== undefined) existing.name_2 = dto.name_2;
      if (dto.number_3 !== undefined) existing.number_3 = dto.number_3;
      if (dto.name_3 !== undefined) existing.name_3 = dto.name_3;
      if (dto.number_4 !== undefined) existing.number_4 = dto.number_4;
      if (dto.name_4 !== undefined) existing.name_4 = dto.name_4;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      number_1: dto.number_1 ?? 0,
      name_1: dto.name_1 ?? null,
      number_2: dto.number_2 ?? 0,
      name_2: dto.name_2 ?? null,
      number_3: dto.number_3 ?? 0,
      name_3: dto.name_3 ?? null,
      number_4: dto.number_4 ?? 0,
      name_4: dto.name_4 ?? null,
    });
    return this.repo.save(entity);
  }
}
