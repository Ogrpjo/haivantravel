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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

// Persist partner icons into the repo-level `../upload/` folder.
// Backward-compat: still allow reading legacy files from `haivantravel-backend/uploads/`.
const UPLOADS_DIR = join(process.cwd(), '..', 'upload');
const LEGACY_UPLOADS_DIR = join(process.cwd(), 'uploads');

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          cb(null, UPLOADS_DIR);
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createPartnerDto: CreatePartnerDto,
  ) {
    if (!file) {
      throw new BadRequestException('Icon file is required.');
    }

    return this.partnersService.create(createPartnerDto, `upload/${file.filename}`);
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
    const primaryPath = join(UPLOADS_DIR, filename);
    if (existsSync(primaryPath)) return res.sendFile(primaryPath);

    const legacyPath = join(LEGACY_UPLOADS_DIR, filename);
    if (existsSync(legacyPath)) return res.sendFile(legacyPath);

    return res.status(404).send('Not found');
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
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          cb(null, UPLOADS_DIR);
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
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    const payload: Partial<{
      business_type: string;
      icon: string;
    }> = {};
    if (updatePartnerDto.business_type != null) {
      payload.business_type = updatePartnerDto.business_type;
    }
    if (file?.filename) {
      payload.icon = `upload/${file.filename}`;
    }
    return this.partnersService.update(Number(id), payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.partnersService.remove(Number(id));
    return deleted ? { deleted: true } : { deleted: false };
  }
}
