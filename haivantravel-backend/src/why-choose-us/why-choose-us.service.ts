import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhyChooseUs } from './why-choose-us.entity';

export interface SaveWhyChooseUsDto {
  image_url?: string | null;
  small_text?: string | null;
  big_text?: string | null;
  description?: string | null;
  tick_1?: string | null;
  tick_2?: string | null;
  tick_3?: string | null;
  tick_4?: string | null;
}

@Injectable()
export class WhyChooseUsService {
  constructor(
    @InjectRepository(WhyChooseUs)
    private readonly repo: Repository<WhyChooseUs>,
  ) {}

  async findOne(): Promise<WhyChooseUs | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveWhyChooseUsDto): Promise<WhyChooseUs> {
    const existing = await this.findOne();

    if (existing) {
      if (dto.image_url !== undefined) existing.image_url = dto.image_url;
      if (dto.small_text !== undefined) existing.small_text = dto.small_text;
      if (dto.big_text !== undefined) existing.big_text = dto.big_text;
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.tick_1 !== undefined) existing.tick_1 = dto.tick_1;
      if (dto.tick_2 !== undefined) existing.tick_2 = dto.tick_2;
      if (dto.tick_3 !== undefined) existing.tick_3 = dto.tick_3;
      if (dto.tick_4 !== undefined) existing.tick_4 = dto.tick_4;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      image_url: dto.image_url ?? null,
      small_text: dto.small_text ?? null,
      big_text: dto.big_text ?? null,
      description: dto.description ?? null,
      tick_1: dto.tick_1 ?? null,
      tick_2: dto.tick_2 ?? null,
      tick_3: dto.tick_3 ?? null,
      tick_4: dto.tick_4 ?? null,
    });
    return this.repo.save(entity);
  }
}

