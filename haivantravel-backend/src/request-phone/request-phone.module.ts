import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestPhone } from './request-phone.entity';
import { RequestPhoneController } from './request-phone.controller';
import { RequestPhoneService } from './request-phone.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestPhone])],
  controllers: [RequestPhoneController],
  providers: [RequestPhoneService],
})
export class RequestPhoneModule {}
