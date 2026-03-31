import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './about.entity';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
