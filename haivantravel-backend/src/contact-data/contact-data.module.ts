import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactData } from './contact-data.entity';
import { ContactDataController } from './contact-data.controller';
import { ContactDataService } from './contact-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactData])],
  controllers: [ContactDataController],
  providers: [ContactDataService],
})
export class ContactDataModule {}
