import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gala } from './gala.entity';
import { GalaController } from './gala.controller';
import { GalaService } from './gala.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gala])],
  controllers: [GalaController],
  providers: [GalaService],
  exports: [GalaService],
})
export class GalaModule {}

