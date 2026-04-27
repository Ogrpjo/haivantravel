import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BriefContact } from './brief-contact.entity';
import { BriefContactController } from './brief-contact.controller';
import { BriefContactService } from './brief-contact.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([BriefContact]), MailModule],
  controllers: [BriefContactController],
  providers: [BriefContactService],
})
export class BriefContactModule {}

