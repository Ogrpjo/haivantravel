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
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), '..', 'upload');
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
    @Body() createPartnerDto: CreatePartnerDto,
  ) {
    if (!file) {
      throw new BadRequestException('Icon file is required.');
    }

    const iconPath = file.path.replace(/\\/g, '/');
    return this.partnersService.create(createPartnerDto, iconPath);
  }

  @Get()
  async findAll() {
    return this.partnersService.findAll();
  }

  @Get('active')
  async findAllActive() {
    return this.partnersService.findAllActive();
  }

  @Get('upload/:filename')
  serveIcon(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename || filename.includes('..')) {
      return res.status(400).send('Invalid filename');
    }
    const uploadsDir = resolve(__dirname, '..', '..', '..', 'upload');
    const filePath = resolve(uploadsDir, filename);
    if (!existsSync(filePath)) {
      return res.status(404).send('Not found');
    }
    return res.sendFile(filePath);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    return this.partnersService.toggleStatus(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), '..', 'upload');
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
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    const payload: Partial<{
      business_type: string;
      icon_size: number;
      icon: string;
    }> = {};
    if (updatePartnerDto.business_type != null) {
      payload.business_type = updatePartnerDto.business_type;
    }
    if (updatePartnerDto.icon_size != null) {
      const size = Number(updatePartnerDto.icon_size);
      if (!Number.isNaN(size)) payload.icon_size = size;
    }
    if (file?.path) {
      payload.icon = file.path.replace(/\\/g, '/');
    }
    return this.partnersService.update(Number(id), payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.partnersService.remove(Number(id));
    return deleted ? { deleted: true } : { deleted: false };
  }
}
