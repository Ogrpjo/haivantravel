import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { MailService } from './mail.service';

class SendTestEmailDto {
  @IsString()
  @IsNotEmpty()
  template_key: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  @Get('config-check')
  @HttpCode(HttpStatus.OK)
  async configCheck() {
    const host = this.configService.get<string>('MAIL_HOST') ?? '';
    const port = Number(this.configService.get<string>('MAIL_PORT') ?? '');
    const secureRaw = this.configService.get<string>('MAIL_SECURE') ?? '';
    const user = this.configService.get<string>('MAIL_USER') ?? '';
    const pass = this.configService.get<string>('MAIL_PASS') ?? '';
    const from = this.configService.get<string>('MAIL_FROM') ?? '';
    const sales = this.configService.get<string>('SALES_NOTIFICATION_EMAIL') ?? '';

    const mask = (value: string) => {
      const v = (value ?? '').trim();
      if (!v) return '';
      if (v.length <= 4) return '*'.repeat(v.length);
      return `${v.slice(0, 2)}***${v.slice(-2)}`;
    };

    return {
      message: 'Kiểm tra biến môi trường (đã mask).',
      data: {
        MAIL_HOST: host ? mask(host) : '',
        MAIL_PORT: Number.isFinite(port) ? port : null,
        MAIL_SECURE: secureRaw,
        MAIL_USER: user ? mask(user) : '',
        MAIL_PASS_SET: Boolean(pass && pass.trim().length > 0),
        MAIL_FROM: from ? mask(from) : '',
        SALES_NOTIFICATION_EMAIL_SET: Boolean(sales && sales.trim().length > 0),
      },
    };
  }

  @Get('queue-status')
  @HttpCode(HttpStatus.OK)
  async queueStatus() {
    return {
      message: 'Trạng thái hàng đợi email.',
      data: this.mailService.getQueueStatus(),
    };
  }

  @Post('test-template')
  @HttpCode(HttpStatus.OK)
  async sendTestTemplate(@Body() dto: SendTestEmailDto) {
    await this.mailService.sendTestTemplatedEmail(dto.template_key, dto.to, {
      full_name: 'Khách hàng mẫu',
      company_name: 'Công ty mẫu',
      phone: '0900000000',
      email: dto.to,
      event_type: 'Workshop',
      attendee_scale: '50-100',
      budget: '100.000.000',
      expected_time: 'Q3/2026',
      requirements: 'Đây là email test từ admin.',
      created_at: new Date().toISOString(),
    });

    return { message: 'Gửi email test thành công.' };
  }
}
