import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './email-template.entity';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
  ) {}

  async seedDefaults() {
    const defaults: CreateEmailTemplateDto[] = [
      {
        key: 'brief_contact_subscriber',
        name: 'Brief Contact - Người đăng ký',
        subject_template:
          'Haivan Event đã nhận đăng ký tư vấn của {{full_name}}',
        html_template: `
          <p>Xin chào {{full_name}},</p>
          <p>Haivan Event đã nhận được thông tin đăng ký tư vấn của bạn.</p>
          <p>Chúng tôi sẽ liên hệ sớm qua số <b>{{phone}}</b> hoặc email <b>{{email}}</b>.</p>
          <p>Trân trọng,<br/>Haivan Event</p>
        `,
        is_active: true,
      },
      {
        key: 'brief_contact_owner',
        name: 'Brief Contact - Chủ doanh nghiệp',
        subject_template: 'Lead mới: {{full_name}} - {{company_name}}',
        html_template: `
          <p>Có một đăng ký tư vấn mới:</p>
          <ul>
            <li>Họ tên: {{full_name}}</li>
            <li>Công ty: {{company_name}}</li>
            <li>Điện thoại: {{phone}}</li>
            <li>Email: {{email}}</li>
            <li>Loại sự kiện: {{event_type}}</li>
            <li>Quy mô: {{attendee_scale}}</li>
            <li>Ngân sách: {{budget}}</li>
            <li>Thời gian: {{expected_time}}</li>
            <li>Yêu cầu: {{requirements}}</li>
          </ul>
        `,
        is_active: true,
      },
    ];

    for (const item of defaults) {
      const exists = await this.emailTemplateRepository.findOne({
        where: { key: item.key },
      });
      if (!exists) {
        await this.emailTemplateRepository.save(
          this.emailTemplateRepository.create(item),
        );
      }
    }
  }

  async create(dto: CreateEmailTemplateDto) {
    const existing = await this.emailTemplateRepository.findOne({
      where: { key: dto.key },
    });
    if (existing) {
      throw new BadRequestException('Template key đã tồn tại.');
    }

    return this.emailTemplateRepository.save(
      this.emailTemplateRepository.create(dto),
    );
  }

  async findAll() {
    return this.emailTemplateRepository.find({
      order: { updated_at: 'DESC' },
    });
  }

  async findByKey(key: string) {
    const template = await this.emailTemplateRepository.findOne({
      where: { key },
    });
    if (!template) {
      throw new NotFoundException('Không tìm thấy email template.');
    }
    return template;
  }

  async update(id: number, dto: UpdateEmailTemplateDto) {
    const template = await this.emailTemplateRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Không tìm thấy email template.');
    }

    const payload = this.emailTemplateRepository.merge(template, dto);
    return this.emailTemplateRepository.save(payload);
  }
}
