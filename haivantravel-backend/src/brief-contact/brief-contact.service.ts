import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BriefContact } from './brief-contact.entity';
import { CreateBriefContactDto } from './dto/create-brief-contact.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BriefContactService {
  constructor(
    @InjectRepository(BriefContact)
    private readonly briefContactRepository: Repository<BriefContact>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateBriefContactDto) {
    const brief = this.briefContactRepository.create(dto);
    const saved = await this.briefContactRepository.save(brief);
    const variables = {
      full_name: saved.full_name,
      company_name: saved.company_name,
      phone: saved.phone,
      email: saved.email,
      event_type: saved.event_type,
      attendee_scale: saved.attendee_scale,
      budget: saved.budget,
      expected_time: saved.expected_time,
      requirements: saved.requirements,
      created_at: saved.created_at.toISOString(),
    };

    await this.mailService.enqueueTemplatedEmail(
      'brief_contact_subscriber',
      saved.email,
      variables,
    );

    const salesEnv =
      this.configService.get<string>('SALES_NOTIFICATION_EMAIL') ?? '';
    const defaultOwner = this.configService.get<string>('MAIL_USER') ?? '';
    const ownerEmails = (salesEnv || defaultOwner)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (ownerEmails.length > 0) {
      await this.mailService.enqueueTemplatedEmail(
        'brief_contact_owner',
        ownerEmails,
        variables,
      );
    }

    return saved;
  }

  async findAll() {
    return this.briefContactRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}

