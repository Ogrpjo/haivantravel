import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventProvider } from './event-provider.entity';
import { EventProviderController } from './event-provider.controller';
import { EventProviderService } from './event-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventProvider])],
  controllers: [EventProviderController],
  providers: [EventProviderService],
  exports: [EventProviderService],
})
export class EventProviderModule {}

