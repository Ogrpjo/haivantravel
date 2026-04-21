import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BriefContact } from './brief-contact.entity';
import { BriefContactController } from './brief-contact.controller';
import { BriefContactService } from './brief-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([BriefContact])],
  controllers: [BriefContactController],
  providers: [BriefContactService],
})
export class BriefContactModule {}

