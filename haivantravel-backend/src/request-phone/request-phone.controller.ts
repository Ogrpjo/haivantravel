import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RequestPhoneService } from './request-phone.service';
import { CreateRequestPhoneDto } from './dto/create-request-phone.dto';

@Controller('request-phone')
export class RequestPhoneController {
  constructor(private readonly requestPhoneService: RequestPhoneService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const requests = await this.requestPhoneService.findAll();

    return {
      message: 'Lấy danh sách đăng kí tư vấn thành công.',
      data: requests,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestPhoneDto) {
    const saved = await this.requestPhoneService.create(dto);

    return {
      message: 'Gửi yêu cầu tư vấn thành công.',
      data: saved,
    };
  }
}
