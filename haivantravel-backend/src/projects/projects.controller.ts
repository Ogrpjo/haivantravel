import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

const UPLOADS_DIR = join(__dirname, '..', '..', '..', 'upload');

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          cb(null, UPLOADS_DIR);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `project-${unique}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype?.toLowerCase() ?? '';
        if (allowed.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Chỉ cho phép file ảnh (jpg, png, webp).'),
            false,
          );
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Multer.File,
    @Body() createDto: CreateProjectDto,
  ) {
    if (!file) {
      throw new BadRequestException('Cần chọn ảnh dự án.');
    }
    const imageUrl = `upload/${file.filename}`;
    return this.projectsService.create(createDto, imageUrl);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          cb(null, UPLOADS_DIR);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `project-${unique}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype?.toLowerCase() ?? '';
        if (allowed.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Chỉ cho phép file ảnh (jpg, png, webp).'),
            false,
          );
        }
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Multer.File | undefined,
    @Body() updateDto: UpdateProjectDto,
  ) {
    const payload: Partial<{ link_url: string; image_url: string }> = {};
    if (updateDto.link_url != null) payload.link_url = updateDto.link_url;
    if (file) payload.image_url = `upload/${file.filename}`;

    const updated = await this.projectsService.update(Number(id), payload);
    if (!updated) throw new NotFoundException('Không tìm thấy dự án.');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.projectsService.remove(Number(id));
    if (!ok) throw new NotFoundException('Không tìm thấy dự án.');
    return { deleted: true };
  }
}
