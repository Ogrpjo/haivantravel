import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@Controller('email-templates')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const templates = await this.emailTemplateService.findAll();
    return { message: 'Lấy danh sách email template thành công.', data: templates };
  }

  @Get(':key')
  @HttpCode(HttpStatus.OK)
  async findByKey(@Param('key') key: string) {
    const template = await this.emailTemplateService.findByKey(key);
    return { message: 'Lấy email template thành công.', data: template };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEmailTemplateDto) {
    const created = await this.emailTemplateService.create(dto);
    return { message: 'Tạo email template thành công.', data: created };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmailTemplateDto,
  ) {
    const updated = await this.emailTemplateService.update(id, dto);
    return { message: 'Cập nhật email template thành công.', data: updated };
  }
}
