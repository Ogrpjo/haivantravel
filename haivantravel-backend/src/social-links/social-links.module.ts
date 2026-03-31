import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinksController } from './social-links.controller';
import { SocialLinksService } from './social-links.service';
import { SocialLink } from './social-links.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLink])],
  controllers: [SocialLinksController],
  providers: [SocialLinksService],
})
export class SocialLinksModule {}
