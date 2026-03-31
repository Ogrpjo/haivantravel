import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteContent } from './website-content.entity';
import { CreateWebsiteContentDto } from './dto/create-website-content.dto';
import { UpdateWebsiteContentDto } from './dto/update-website-content.dto';

@Injectable()
export class WebsiteContentService {
  constructor(
    @InjectRepository(WebsiteContent)
    private readonly repo: Repository<WebsiteContent>,
  ) {}

  async create(dto: CreateWebsiteContentDto): Promise<WebsiteContent> {
    const entity = this.repo.create({
      page: dto.page as 'home' | 'blog',
      section: dto.section as WebsiteContent['section'],
      title: dto.title ?? null,
      description: dto.description ?? null,
      image_url: dto.image_url ?? null,
      extra_data: dto.extra_data ?? null,
    });
    return this.repo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateWebsiteContentDto,
  ): Promise<WebsiteContent | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    if (dto.page != null) entity.page = dto.page as 'home' | 'blog';
    if (dto.section != null)
      entity.section = dto.section as WebsiteContent['section'];
    if (dto.title !== undefined) entity.title = dto.title ?? null;
    if (dto.description !== undefined)
      entity.description = dto.description ?? null;
    if (dto.image_url !== undefined) entity.image_url = dto.image_url ?? null;
    if (dto.extra_data !== undefined)
      entity.extra_data = dto.extra_data ?? null;
    return this.repo.save(entity);
  }

  async findByPage(page: string): Promise<WebsiteContent[]> {
    return this.repo.find({
      where: { page: page as WebsiteContent['page'] },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<WebsiteContent | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPageAndSection(
    page: string,
    section: string,
  ): Promise<WebsiteContent | null> {
    return this.repo.findOne({
      where: {
        page: page as WebsiteContent['page'],
        section: section as WebsiteContent['section'],
      },
    });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
