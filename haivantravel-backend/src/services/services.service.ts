import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, iconPath: string) {
    const service = this.serviceRepository.create({
      title: createServiceDto.title,
      description: createServiceDto.description,
      icon: iconPath,
    });

    return this.serviceRepository.save(service);
  }

  async findAll() {
    return this.serviceRepository.find({ order: { createAt: 'DESC' } });
  }

  async findAllActive() {
    return this.serviceRepository.find({
      where: { is_active: true },
      order: { createAt: 'DESC' },
    });
  }

  async toggleStatus(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      return null;
    }

    service.is_active = !service.is_active;
    return this.serviceRepository.save(service);
  }

  async update(
    id: number,
    updateDto: Partial<{ title: string; description: string; icon: string }>,
  ) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      return null;
    }
    if (updateDto.title != null) service.title = updateDto.title;
    if (updateDto.description != null)
      service.description = updateDto.description;
    if (updateDto.icon != null) service.icon = updateDto.icon;
    return this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.serviceRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
