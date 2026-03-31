import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutUs } from './about-us.entity';

export interface SaveAboutUsDto {
  description?: string | null;
  image_url?: string | null;
}

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly repo: Repository<AboutUs>,
  ) {}

  async findOne(): Promise<AboutUs | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveAboutUsDto): Promise<AboutUs> {
    const existing = await this.repo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (existing) {
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.image_url !== undefined) existing.image_url = dto.image_url;
      return this.repo.save(existing);
    }
    const entity = this.repo.create({
      description: dto.description ?? null,
      image_url: dto.image_url ?? null,
    });
    return this.repo.save(entity);
  }
}
