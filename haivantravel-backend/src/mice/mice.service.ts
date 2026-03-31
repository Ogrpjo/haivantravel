import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mice } from './mice.entity';
import { SaveMiceDto } from './dto/save-mice.dto';
import { saveSingleRichText } from '../common/saveSingleRichText';

@Injectable()
export class MiceService {
  constructor(
    @InjectRepository(Mice)
    private readonly repo: Repository<Mice>,
  ) {}

  async findOne(): Promise<Mice | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveMiceDto): Promise<Mice> {
    return saveSingleRichText(this.repo, dto.content);
  }
}

