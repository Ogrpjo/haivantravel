import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ContactDataService } from './contact-data.service';
import { CreateContactDataDto } from './dto/create-contact-data.dto';

@Controller('contact-data')
export class ContactDataController {
  constructor(private readonly contactDataService: ContactDataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const contacts = await this.contactDataService.findAll();

    return {
      message: 'Lấy danh sách liên hệ thành công.',
      data: contacts,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateContactDataDto) {
    const saved = await this.contactDataService.create(dto);

    return {
      message: 'Gửi thông tin liên hệ thành công.',
      data: saved,
    };
  }
}
