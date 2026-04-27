import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { join } from 'path';
import * as fs from 'fs';

const UPLOADS_DIR = join(process.cwd(), '..', 'upload');

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(createDto: CreateProjectDto, imageUrl: string) {
    const project = this.projectsRepository.create({
      title: createDto.title.trim(),
      short_description: createDto.short_description?.trim() || null,
      project_type: createDto.project_type.trim(),
      duration_days: createDto.duration_days ?? null,
      guest_count: createDto.guest_count ?? null,
      artist_count: createDto.artist_count ?? null,
      link_url:
        createDto.link_url?.trim() || 'https://haivanevent.vn/case-study',
      image_url: imageUrl,
      content: createDto.content?.trim() || null,
      html_content: createDto.html_content?.trim() || null,
      css_content: createDto.css_content?.trim() || null,
      seo_title: createDto.seo_title?.trim() || null,
      seo_keywords: createDto.seo_keywords?.trim() || null,
      seo_description: createDto.seo_description?.trim() || null,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    projectType?: string;
  }) {
    const qb = this.projectsRepository
      .createQueryBuilder('project')
      .orderBy('project.id', 'DESC');

    if (options?.projectType) {
      qb.where('LOWER(project.project_type) = LOWER(:projectType)', {
        projectType: options.projectType,
      });
    }

    if (options?.offset !== undefined) qb.skip(options.offset);
    if (options?.limit !== undefined) qb.take(options.limit);

    return qb.getMany();
  }

  async findOne(id: number) {
    return this.projectsRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateDto: Partial<{
      title: string;
      short_description: string | null;
      project_type: string;
      duration_days: number;
      guest_count: number;
      artist_count: number;
      link_url: string;
      image_url: string;
      content: string | null;
      html_content: string | null;
      css_content: string | null;
      seo_title: string | null;
      seo_keywords: string | null;
      seo_description: string | null;
    }>,
  ) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) return null;

    if (updateDto.title !== undefined) {
      const t = updateDto.title.trim();
      if (!t) {
        throw new BadRequestException('Tên dự án không được để trống.');
      }
      project.title = t;
    }

    if (updateDto.short_description !== undefined) {
      const s = updateDto.short_description?.trim() ?? '';
      project.short_description = s.length > 0 ? s : null;
    }

    if (updateDto.project_type !== undefined) {
      const pt = updateDto.project_type.trim();
      if (!pt) {
        throw new BadRequestException('Loại dự án không được để trống.');
      }
      project.project_type = pt;
    }

    if (updateDto.duration_days !== undefined) {
      project.duration_days = updateDto.duration_days;
    }

    if (updateDto.guest_count !== undefined) {
      project.guest_count = updateDto.guest_count;
    }

    if (updateDto.artist_count !== undefined) {
      project.artist_count = updateDto.artist_count;
    }

    if (updateDto.link_url != null) {
      project.link_url = updateDto.link_url;
    }

    if (updateDto.content !== undefined) {
      const nextContent = (updateDto.content ?? '').trim();
      project.content = nextContent.length > 0 ? nextContent : null;
    }

    if (updateDto.html_content !== undefined) {
      const nextHtml = (updateDto.html_content ?? '').trim();
      project.html_content = nextHtml.length > 0 ? nextHtml : null;
    }

    if (updateDto.css_content !== undefined) {
      const nextCss = (updateDto.css_content ?? '').trim();
      project.css_content = nextCss.length > 0 ? nextCss : null;
    }

    if (updateDto.seo_title !== undefined) {
      const nextSeoTitle = (updateDto.seo_title ?? '').trim();
      project.seo_title = nextSeoTitle.length > 0 ? nextSeoTitle : null;
    }

    if (updateDto.seo_keywords !== undefined) {
      const nextSeoKeywords = (updateDto.seo_keywords ?? '').trim();
      project.seo_keywords = nextSeoKeywords.length > 0 ? nextSeoKeywords : null;
    }

    if (updateDto.seo_description !== undefined) {
      const nextSeoDescription = (updateDto.seo_description ?? '').trim();
      project.seo_description =
        nextSeoDescription.length > 0 ? nextSeoDescription : null;
    }

    if (updateDto.image_url != null) {
      const previous = project.image_url;
      project.image_url = updateDto.image_url;

      // Best-effort cleanup old file (ignore errors).
      if (previous && (previous.startsWith('upload/') || previous.startsWith('uploads/'))) {
        const filename = previous.split('/').pop();
        if (filename) {
          const oldPath = join(UPLOADS_DIR, filename);
          try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          } catch {
            // ignore
          }
        }
      }
    }

    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<boolean> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) return false;

    const result = await this.projectsRepository.delete(id);
    const deleted = (result.affected ?? 0) > 0;
    if (!deleted) return false;

    // Best-effort cleanup file (ignore errors).
    const imageUrl = project.image_url;
    if (imageUrl && (imageUrl.startsWith('upload/') || imageUrl.startsWith('uploads/'))) {
      const filename = imageUrl.split('/').pop();
      if (filename) {
        const filePath = join(UPLOADS_DIR, filename);
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch {
          // ignore
        }
      }
    }

    return true;
  }
}
