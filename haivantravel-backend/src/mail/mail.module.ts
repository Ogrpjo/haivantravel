import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { EmailTemplateModule } from '../email-template/email-template.module';

@Module({
  imports: [EmailTemplateModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
