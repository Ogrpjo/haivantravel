import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestPhone } from './request-phone.entity';
import { CreateRequestPhoneDto } from './dto/create-request-phone.dto';

@Injectable()
export class RequestPhoneService {
  constructor(
    @InjectRepository(RequestPhone)
    private readonly requestPhoneRepository: Repository<RequestPhone>,
  ) {}

  async create(dto: CreateRequestPhoneDto) {
    const request = this.requestPhoneRepository.create({
      phone: dto.phone,
    });

    return this.requestPhoneRepository.save(request);
  }

  async findAll() {
    return this.requestPhoneRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}
