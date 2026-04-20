import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WorkingProcessCard,
  WorkingProcessContent,
} from './working-process-content.entity';

export interface SaveWorkingProcessContentDto {
  small_text?: string | null;
  big_text?: string | null;
  description?: string | null;
  cards?: WorkingProcessCard[] | null;
}

@Injectable()
export class WorkingProcessContentService {
  constructor(
    @InjectRepository(WorkingProcessContent)
    private readonly repo: Repository<WorkingProcessContent>,
  ) {}

  async findOne(): Promise<WorkingProcessContent | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveWorkingProcessContentDto): Promise<WorkingProcessContent> {
    const existing = await this.findOne();
    if (existing) {
      if (dto.small_text !== undefined) existing.small_text = dto.small_text;
      if (dto.big_text !== undefined) existing.big_text = dto.big_text;
      if (dto.description !== undefined) existing.description = dto.description;
      if (dto.cards !== undefined) existing.cards = dto.cards;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      small_text: dto.small_text ?? null,
      big_text: dto.big_text ?? null,
      description: dto.description ?? null,
      cards: dto.cards ?? null,
    });
    return this.repo.save(entity);
  }
}

