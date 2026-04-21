import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BriefContact } from './brief-contact.entity';
import { CreateBriefContactDto } from './dto/create-brief-contact.dto';

@Injectable()
export class BriefContactService {
  constructor(
    @InjectRepository(BriefContact)
    private readonly briefContactRepository: Repository<BriefContact>,
  ) {}

  async create(dto: CreateBriefContactDto) {
    const brief = this.briefContactRepository.create(dto);
    return this.briefContactRepository.save(brief);
  }

  async findAll() {
    return this.briefContactRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}

