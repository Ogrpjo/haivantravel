import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionCreator } from './emotion-creator.entity';

export interface SaveEmotionCreatorDto {
  center_image_url?: string | null;
  left_image_url?: string | null;
  right_image_url?: string | null;
  title?: string | null;
  description?: string | null;
  description_detail?: string | null;
}

@Injectable()
export class EmotionCreatorService {
  constructor(
    @InjectRepository(EmotionCreator)
    private readonly repo: Repository<EmotionCreator>,
  ) {}

  async findOne(): Promise<EmotionCreator | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  /** Lưu hoặc cập nhật một bản ghi (upsert). */
  async save(dto: SaveEmotionCreatorDto): Promise<EmotionCreator> {
    const existing = await this.repo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (existing) {
      if (dto.center_image_url !== undefined)
        existing.center_image_url = dto.center_image_url;
      if (dto.left_image_url !== undefined)
        existing.left_image_url = dto.left_image_url;
      if (dto.right_image_url !== undefined)
        existing.right_image_url = dto.right_image_url;
      if (dto.title !== undefined) existing.title = dto.title;
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.description_detail !== undefined)
        existing.description_detail = dto.description_detail;
      return this.repo.save(existing);
    }
    const entity = this.repo.create({
      center_image_url: dto.center_image_url ?? null,
      left_image_url: dto.left_image_url ?? null,
      right_image_url: dto.right_image_url ?? null,
      title: dto.title ?? null,
      description: dto.description ?? null,
      description_detail: dto.description_detail ?? null,
    });
    return this.repo.save(entity);
  }
}
