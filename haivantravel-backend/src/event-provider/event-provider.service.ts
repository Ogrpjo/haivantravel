import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventProvider, EventProviderCard } from './event-provider.entity';

export interface SaveEventProviderDto {
  small_text?: string | null;
  big_text?: string | null;
  right_text?: string | null;
  cards?: EventProviderCard[] | null;
}

@Injectable()
export class EventProviderService {
  constructor(
    @InjectRepository(EventProvider)
    private readonly repo: Repository<EventProvider>,
  ) {}

  async findOne(): Promise<EventProvider | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveEventProviderDto): Promise<EventProvider> {
    const existing = await this.findOne();

    if (existing) {
      if (dto.small_text !== undefined) existing.small_text = dto.small_text;
      if (dto.big_text !== undefined) existing.big_text = dto.big_text;
      if (dto.right_text !== undefined) existing.right_text = dto.right_text;
      if (dto.cards !== undefined) existing.cards = dto.cards;
      return this.repo.save(existing);
    }

    const entity = this.repo.create({
      small_text: dto.small_text ?? null,
      big_text: dto.big_text ?? null,
      right_text: dto.right_text ?? null,
      cards: dto.cards ?? null,
    });
    return this.repo.save(entity);
  }
}

