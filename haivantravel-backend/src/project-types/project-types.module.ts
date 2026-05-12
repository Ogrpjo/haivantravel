import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './project-type.entity';
import { ProjectTypesController } from './project-types.controller';
import { ProjectTypesService } from './project-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectType])],
  controllers: [ProjectTypesController],
  providers: [ProjectTypesService],
  exports: [ProjectTypesService],
})
export class ProjectTypesModule implements OnModuleInit {
  constructor(private readonly projectTypesService: ProjectTypesService) {}

  async onModuleInit() {
    await this.projectTypesService.seedDefaults();
  }
}
