import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gala } from './gala.entity';
import { SaveGalaDto } from './dto/save-gala.dto';
import { saveSingleRichText } from '../common/saveSingleRichText';

@Injectable()
export class GalaService {
  constructor(
    @InjectRepository(Gala)
    private readonly repo: Repository<Gala>,
  ) {}

  async findOne(): Promise<Gala | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveGalaDto): Promise<Gala> {
    return saveSingleRichText(this.repo, dto.content);
  }
}

