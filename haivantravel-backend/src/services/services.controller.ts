import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Get,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { extname, join, resolve } from 'path';
import * as fs from 'fs';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype.toLowerCase();

        if (allowedTypes.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Multer.File,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    if (!file) {
      throw new BadRequestException('Icon file is required.');
    }

    const iconPath = file.path.replace(/\\/g, '/');
    return this.servicesService.create(createServiceDto, iconPath);
  }

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get('active')
  async findAllActive() {
    return this.servicesService.findAllActive();
  }

  @Get('uploads/:filename')
  serveIcon(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename || filename.includes('..')) {
      return res.status(400).send('Invalid filename');
    }
    const uploadsDir = resolve(__dirname, '..', '..', 'uploads');
    const filePath = resolve(uploadsDir, filename);
    if (!existsSync(filePath)) {
      return res.status(404).send('Not found');
    }
    return res.sendFile(filePath);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    return this.servicesService.toggleStatus(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype.toLowerCase();
        if (allowedTypes.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Multer.File | undefined,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const payload: Partial<{
      title: string;
      description: string;
      icon: string;
    }> = {};
    if (updateServiceDto.title != null) {
      payload.title = updateServiceDto.title;
    }
    if (updateServiceDto.description != null) {
      payload.description = updateServiceDto.description;
    }
    if (file?.path) {
      payload.icon = file.path.replace(/\\/g, '/');
    }
    return this.servicesService.update(Number(id), payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.servicesService.remove(Number(id));
    return deleted ? { deleted: true } : { deleted: false };
  }
}
