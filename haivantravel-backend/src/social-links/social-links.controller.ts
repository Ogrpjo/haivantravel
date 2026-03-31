import { Body, Controller, Get, Post } from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @Post()
  async create(@Body() createDto: CreateSocialLinkDto) {
    return this.socialLinksService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.socialLinksService.findAll();
  }
}
