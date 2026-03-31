import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { join } from 'path';
import * as fs from 'fs';

const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(createDto: CreateProjectDto, imageUrl: string) {
    const project = this.projectsRepository.create({
      link_url: createDto.link_url,
      image_url: imageUrl,
    });
    return this.projectsRepository.save(project);
  }

  async findAll() {
    return this.projectsRepository.find({ order: { id: 'DESC' } });
  }

  async update(
    id: number,
    updateDto: Partial<{ link_url: string; image_url: string }>,
  ) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) return null;

    if (updateDto.link_url != null) {
      project.link_url = updateDto.link_url;
    }

    if (updateDto.image_url != null) {
      const previous = project.image_url;
      project.image_url = updateDto.image_url;

      // Best-effort cleanup old file (ignore errors).
      if (previous && previous.startsWith('uploads/')) {
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
    if (imageUrl && imageUrl.startsWith('uploads/')) {
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
