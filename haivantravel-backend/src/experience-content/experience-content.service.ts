import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceContent } from './experience-content.entity';

export interface SaveExperienceContentDto {
  small_text?: string | null;
  big_text?: string | null;
  description?: string | null;
  big_image_url?: string | null;
  small_image_1_url?: string | null;
  small_image_1_name?: string | null;
  small_image_2_url?: string | null;
  small_image_2_name?: string | null;
  small_image_3_url?: string | null;
  small_image_3_name?: string | null;
  small_image_4_url?: string | null;
  small_image_4_name?: string | null;
}

@Injectable()
export class ExperienceContentService {
  constructor(
    @InjectRepository(ExperienceContent)
    private readonly repo: Repository<ExperienceContent>,
  ) {}

  async findOne(): Promise<ExperienceContent | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveExperienceContentDto): Promise<ExperienceContent> {
    const existing = await this.findOne();
    if (existing) {
      if (dto.small_text !== undefined) existing.small_text = dto.small_text;
      if (dto.big_text !== undefined) existing.big_text = dto.big_text;
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.big_image_url !== undefined) existing.big_image_url = dto.big_image_url;
      if (dto.small_image_1_url !== undefined) existing.small_image_1_url = dto.small_image_1_url;
      if (dto.small_image_1_name !== undefined) existing.small_image_1_name = dto.small_image_1_name;
      if (dto.small_image_2_url !== undefined) existing.small_image_2_url = dto.small_image_2_url;
      if (dto.small_image_2_name !== undefined) existing.small_image_2_name = dto.small_image_2_name;
      if (dto.small_image_3_url !== undefined) existing.small_image_3_url = dto.small_image_3_url;
      if (dto.small_image_3_name !== undefined) existing.small_image_3_name = dto.small_image_3_name;
      if (dto.small_image_4_url !== undefined) existing.small_image_4_url = dto.small_image_4_url;
      if (dto.small_image_4_name !== undefined) existing.small_image_4_name = dto.small_image_4_name;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      small_text: dto.small_text ?? null,
      big_text: dto.big_text ?? null,
      description: dto.description ?? null,
      big_image_url: dto.big_image_url ?? null,
      small_image_1_url: dto.small_image_1_url ?? null,
      small_image_1_name: dto.small_image_1_name ?? null,
      small_image_2_url: dto.small_image_2_url ?? null,
      small_image_2_name: dto.small_image_2_name ?? null,
      small_image_3_url: dto.small_image_3_url ?? null,
      small_image_3_name: dto.small_image_3_name ?? null,
      small_image_4_url: dto.small_image_4_url ?? null,
      small_image_4_name: dto.small_image_4_name ?? null,
    });
    return this.repo.save(entity);
  }
}

