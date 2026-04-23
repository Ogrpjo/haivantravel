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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

const UPLOADS_DIR = join(process.cwd(), '..', 'upload');

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 150 * 1024 * 1024,
        // Remove small text-field cap for `content` when sending UI-block JSON.
        fieldSize: 50 * 1024 * 1024,
      },
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateProjectDto,
  ) {
    if (!file) {
      throw new BadRequestException('Cần chọn ảnh dự án.');
    }
    const imageUrl = `upload/${file.filename}`;
    return this.projectsService.create(createDto, imageUrl);
  }

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('project_type') projectType?: string,
  ) {
    const parsedLimit =
      limit !== undefined && !Number.isNaN(Number(limit))
        ? Math.max(1, Number(limit))
        : undefined;
    const parsedOffset =
      offset !== undefined && !Number.isNaN(Number(offset))
        ? Math.max(0, Number(offset))
        : undefined;

    return this.projectsService.findAll({
      limit: parsedLimit,
      offset: parsedOffset,
      projectType: projectType?.trim() || undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(Number(id));
    if (!project) throw new NotFoundException('Không tìm thấy dự án.');
    return project;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 150 * 1024 * 1024,
        // Remove small text-field cap for `content` when sending UI-block JSON.
        fieldSize: 50 * 1024 * 1024,
      },
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
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: UpdateProjectDto,
  ) {
    const payload: Partial<{
      title: string;
      short_description: string | null;
      project_type: string;
      duration_days: number;
      guest_count: number;
      artist_count: number;
      link_url: string;
      image_url: string;
      content: string | null;
      html_content: string | null;
      css_content: string | null;
      seo_title: string | null;
      seo_keywords: string | null;
      seo_description: string | null;
    }> = {};
    if (updateDto.title !== undefined) payload.title = updateDto.title;
    if (updateDto.short_description !== undefined) {
      payload.short_description = updateDto.short_description;
    }
    if (updateDto.project_type !== undefined) {
      payload.project_type = updateDto.project_type;
    }
    if (updateDto.duration_days !== undefined) {
      payload.duration_days = updateDto.duration_days;
    }
    if (updateDto.guest_count !== undefined) {
      payload.guest_count = updateDto.guest_count;
    }
    if (updateDto.artist_count !== undefined) {
      payload.artist_count = updateDto.artist_count;
    }
    if (updateDto.link_url != null) payload.link_url = updateDto.link_url;
    if (updateDto.content !== undefined) payload.content = updateDto.content;
    if (updateDto.html_content !== undefined) {
      payload.html_content = updateDto.html_content;
    }
    if (updateDto.css_content !== undefined) {
      payload.css_content = updateDto.css_content;
    }
    if (updateDto.seo_title !== undefined) payload.seo_title = updateDto.seo_title;
    if (updateDto.seo_keywords !== undefined) {
      payload.seo_keywords = updateDto.seo_keywords;
    }
    if (updateDto.seo_description !== undefined) {
      payload.seo_description = updateDto.seo_description;
    }
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
