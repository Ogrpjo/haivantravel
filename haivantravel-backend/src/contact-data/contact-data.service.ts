import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactData } from './contact-data.entity';
import { CreateContactDataDto } from './dto/create-contact-data.dto';

@Injectable()
export class ContactDataService {
  constructor(
    @InjectRepository(ContactData)
    private readonly contactDataRepository: Repository<ContactData>,
  ) {}

  async create(dto: CreateContactDataDto) {
    const contact = this.contactDataRepository.create({
      full_name: dto.full_name,
      phone: dto.phone,
      email: dto.email,
      location: dto.location ?? null,
      description: dto.description ?? null,
    });

    return this.contactDataRepository.save(contact);
  }

  async findAll() {
    return this.contactDataRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}
