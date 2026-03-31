import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogDetail } from './blog-details.entity';
import { BlogDetailsController } from './blog-details.controller';
import { BlogDetailsService } from './blog-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogDetail])],
  controllers: [BlogDetailsController],
  providers: [BlogDetailsService],
})
export class BlogDetailsModule {}
