import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mice } from './mice.entity';
import { MiceController } from './mice.controller';
import { MiceService } from './mice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mice])],
  controllers: [MiceController],
  providers: [MiceService],
  exports: [MiceService],
})
export class MiceModule {}

