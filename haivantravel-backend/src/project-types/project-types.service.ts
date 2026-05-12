import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectType } from './project-type.entity';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';

const DEFAULT_PROJECT_TYPES = [
  'Gala Dinner',
  'Team Building',
  'Conference',
  'Year End Party',
];
const MAX_PROJECT_TYPES = 7;

@Injectable()
export class ProjectTypesService {
  constructor(
    @InjectRepository(ProjectType)
    private readonly projectTypesRepository: Repository<ProjectType>,
  ) {}

  async seedDefaults() {
    const count = await this.projectTypesRepository.count();
    if (count > 0) return;
    const items = DEFAULT_PROJECT_TYPES.map((name, index) =>
      this.projectTypesRepository.create({ name, sort_order: index }),
    );
    await this.projectTypesRepository.save(items);
  }

  findAll() {
    return this.projectTypesRepository.find({ order: { sort_order: 'ASC', id: 'ASC' } });
  }

  async create(dto: CreateProjectTypeDto) {
    const name = dto.name.trim();
    if (!name) throw new BadRequestException('Tên loại dự án không được để trống.');

    const total = await this.projectTypesRepository.count();
    if (total >= MAX_PROJECT_TYPES) {
      throw new BadRequestException(`Chỉ được tối đa ${MAX_PROJECT_TYPES} loại dự án.`);
    }

    const duplicate = await this.projectTypesRepository.findOne({ where: { name } });
    if (duplicate) throw new BadRequestException('Tên loại dự án đã tồn tại.');

    const entity = this.projectTypesRepository.create({ name, sort_order: total });
    return this.projectTypesRepository.save(entity);
  }

  async update(id: number, dto: UpdateProjectTypeDto) {
    const item = await this.projectTypesRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Không tìm thấy loại dự án.');

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) throw new BadRequestException('Tên loại dự án không được để trống.');
      const duplicate = await this.projectTypesRepository.findOne({ where: { name } });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('Tên loại dự án đã tồn tại.');
      }
      item.name = name;
    }

    return this.projectTypesRepository.save(item);
  }

  async remove(id: number) {
    const total = await this.projectTypesRepository.count();
    if (total <= 4) {
      throw new BadRequestException('Cần giữ tối thiểu 4 loại dự án mặc định.');
    }
    const item = await this.projectTypesRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Không tìm thấy loại dự án.');
    await this.projectTypesRepository.delete(id);
    return { deleted: true };
  }
}
