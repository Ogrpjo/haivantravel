import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './social-links.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,
  ) {}

  async create(createDto: CreateSocialLinkDto) {
    const socialLink = this.socialLinkRepository.create({
      title: createDto.title,
      url: createDto.url,
      isActive: true,
    });

    return this.socialLinkRepository.save(socialLink);
  }

  async findAll() {
    return this.socialLinkRepository.find({ order: { id: 'DESC' } });
  }
}
