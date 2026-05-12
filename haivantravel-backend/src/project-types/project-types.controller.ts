import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectTypesService } from './project-types.service';

@Controller('project-types')
export class ProjectTypesController {
  constructor(private readonly projectTypesService: ProjectTypesService) {}

  @Get()
  findAll() {
    return this.projectTypesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateProjectTypeDto) {
    return this.projectTypesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectTypeDto) {
    return this.projectTypesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectTypesService.remove(Number(id));
  }
}
