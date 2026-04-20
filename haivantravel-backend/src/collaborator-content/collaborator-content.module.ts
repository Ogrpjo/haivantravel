import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorContent } from './collaborator-content.entity';
import { CollaboratorContentController } from './collaborator-content.controller';
import { CollaboratorContentService } from './collaborator-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollaboratorContent])],
  controllers: [CollaboratorContentController],
  providers: [CollaboratorContentService],
  exports: [CollaboratorContentService],
})
export class CollaboratorContentModule {}
