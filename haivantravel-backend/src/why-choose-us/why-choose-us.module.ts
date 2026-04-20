import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyChooseUs } from './why-choose-us.entity';
import { WhyChooseUsController } from './why-choose-us.controller';
import { WhyChooseUsService } from './why-choose-us.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhyChooseUs])],
  controllers: [WhyChooseUsController],
  providers: [WhyChooseUsService],
  exports: [WhyChooseUsService],
})
export class WhyChooseUsModule {}

