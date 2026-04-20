import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistic } from './statistic.entity';

export interface SaveStatisticDto {
  small_text?: string | null;
  big_text?: string | null;
  number_1?: string | null;
  name_1?: string | null;
  number_2?: string | null;
  name_2?: string | null;
  number_3?: string | null;
  name_3?: string | null;
  number_4?: string | null;
  name_4?: string | null;
}

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Statistic)
    private readonly repo: Repository<Statistic>,
  ) {}

  async findOne(): Promise<Statistic | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveStatisticDto): Promise<Statistic> {
    const existing = await this.findOne();

    if (existing) {
      if (dto.small_text !== undefined) existing.small_text = dto.small_text;
      if (dto.big_text !== undefined) existing.big_text = dto.big_text;
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
      small_text: dto.small_text ?? null,
      big_text: dto.big_text ?? null,
      number_1: dto.number_1 ?? '0',
      name_1: dto.name_1 ?? null,
      number_2: dto.number_2 ?? '0',
      name_2: dto.name_2 ?? null,
      number_3: dto.number_3 ?? '0',
      name_3: dto.name_3 ?? null,
      number_4: dto.number_4 ?? '0',
      name_4: dto.name_4 ?? null,
    });
    return this.repo.save(entity);
  }
}
