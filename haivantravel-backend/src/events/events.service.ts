import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { SaveEventDto } from './dto/save-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

  async findOne(): Promise<Event | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveEventDto): Promise<Event> {
    const existing = await this.repo.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (existing) {
      if (dto.name !== undefined) existing.name = dto.name ?? null;
      if (dto.time !== undefined) existing.time = dto.time ?? null;
      return this.repo.save(existing);
    }
    const entity = this.repo.create({
      name: dto.name ?? null,
      time: dto.time ?? null,
    });
    return this.repo.save(entity);
  }
}
