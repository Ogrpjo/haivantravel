import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  NotFoundException,
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.briefContactService.deleteOne(id);
    } catch {
      throw new NotFoundException(`Không tìm thấy brief_contact với id ${id}.`);
    }

    return {
      message: 'Xóa brief liên hệ thành công.',
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAll() {
    await this.briefContactService.deleteAll();

    return {
      message: 'Xóa toàn bộ brief liên hệ thành công.',
    };
  }
}

