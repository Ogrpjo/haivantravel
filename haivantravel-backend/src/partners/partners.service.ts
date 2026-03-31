import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto, iconPath: string) {
    const partner = this.partnerRepository.create({
      business_type: createPartnerDto.business_type,
      icon_size: createPartnerDto.icon_size,
      icon: iconPath,
    });

    return this.partnerRepository.save(partner);
  }

  async findAll() {
    return this.partnerRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findAllActive() {
    return this.partnerRepository.find({
      where: { is_active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async toggleStatus(id: number) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      return null;
    }

    partner.is_active = !partner.is_active;
    return this.partnerRepository.save(partner);
  }

  async update(
    id: number,
    updateDto: Partial<{
      business_type: string;
      icon_size: number;
      icon: string;
    }>,
  ) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      return null;
    }
    if (updateDto.business_type != null)
      partner.business_type = updateDto.business_type;
    if (updateDto.icon_size != null) partner.icon_size = updateDto.icon_size;
    if (updateDto.icon != null) partner.icon = updateDto.icon;
    return this.partnerRepository.save(partner);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.partnerRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
