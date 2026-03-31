import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionCreator } from './emotion-creator.entity';
import { EmotionCreatorController } from './emotion-creator.controller';
import { EmotionCreatorService } from './emotion-creator.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmotionCreator])],
  controllers: [EmotionCreatorController],
  providers: [EmotionCreatorService],
  exports: [EmotionCreatorService],
})
export class EmotionCreatorModule {}
