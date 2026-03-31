import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamBuilding } from './teambuilding.entity';
import { SaveTeamBuildingDto } from './dto/save-teambuilding.dto';
import { saveSingleRichText } from '../common/saveSingleRichText';

@Injectable()
export class TeamBuildingService {
  constructor(
    @InjectRepository(TeamBuilding)
    private readonly repo: Repository<TeamBuilding>,
  ) {}

  async findOne(): Promise<TeamBuilding | null> {
    return this.repo.findOne({ where: {}, order: { id: 'ASC' } });
  }

  async save(dto: SaveTeamBuildingDto): Promise<TeamBuilding> {
    return saveSingleRichText(this.repo, dto.content);
  }
}

