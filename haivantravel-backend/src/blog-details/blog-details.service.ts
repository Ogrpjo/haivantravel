import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogDetail } from './blog-details.entity';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';

@Injectable()
export class BlogDetailsService {
  constructor(
    @InjectRepository(BlogDetail)
    private readonly blogDetailRepository: Repository<BlogDetail>,
  ) {}

  async create(dto: CreateBlogDetailDto) {
    const blogDetail = this.blogDetailRepository.create({
      title: dto.title,
      slug: dto.slug,
      type: dto.type ?? null,
      content: dto.content ?? null,
      demo_image: dto.demo_image ?? null,
      meta_title: dto.meta_title ?? null,
      meta_keywords: dto.meta_keywords ?? null,
      meta_description: dto.meta_description ?? null,
    });
    return this.blogDetailRepository.save(blogDetail);
  }

  async findAll() {
    return this.blogDetailRepository.find({ order: { id: 'DESC' } });
  }

  async findBySlug(slug: string) {
    return this.blogDetailRepository.findOne({ where: { slug } });
  }

  async update(id: number, payload: Partial<BlogDetail>) {
    await this.blogDetailRepository.update(id, payload);
    return this.blogDetailRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.blogDetailRepository.delete(id);
    return result.affected && result.affected > 0;
  }
}
