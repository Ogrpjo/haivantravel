import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BriefContactService } from './brief-contact.service';
import { CreateBriefContactDto } from './dto/create-brief-contact.dto';

@Controller('brief-contact')
export class BriefContactController {
  constructor(private readonly briefContactService: BriefContactService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const briefs = await this.briefContactService.findAll();

    return {
      message: 'Lấy danh sách brief liên hệ thành công.',
      data: briefs,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBriefContactDto) {
    const saved = await this.briefContactService.create(dto);

    return {
      message: 'Gửi brief thành công.',
      data: saved,
    };
  }
}

