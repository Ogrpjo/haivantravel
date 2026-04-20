import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollaboratorContent } from './collaborator-content.entity';

export interface SaveCollaboratorContentDto {
  first_text?: string | null;
  blue_text_1?: string | null;
  blue_text_2?: string | null;
  last_text?: string | null;
  description?: string | null;
}

@Injectable()
export class CollaboratorContentService {
  constructor(
    @InjectRepository(CollaboratorContent)
    private readonly repo: Repository<CollaboratorContent>,
  ) {}

  async findOne(): Promise<CollaboratorContent | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveCollaboratorContentDto): Promise<CollaboratorContent> {
    const existing = await this.findOne();

    if (existing) {
      if (dto.first_text !== undefined) existing.first_text = dto.first_text;
      if (dto.blue_text_1 !== undefined) existing.blue_text_1 = dto.blue_text_1;
      if (dto.blue_text_2 !== undefined) existing.blue_text_2 = dto.blue_text_2;
      if (dto.last_text !== undefined) existing.last_text = dto.last_text;
      if (dto.description !== undefined) existing.description = dto.description;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      first_text: dto.first_text ?? null,
      blue_text_1: dto.blue_text_1 ?? null,
      blue_text_2: dto.blue_text_2 ?? null,
      last_text: dto.last_text ?? null,
      description: dto.description ?? null,
    });
    return this.repo.save(entity);
  }
}
