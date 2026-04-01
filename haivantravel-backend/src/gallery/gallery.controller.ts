import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { GalleryService } from './gallery.service';

const UPLOADS_DIR = join(process.cwd(), '..', 'upload');
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface MulterFile {
  fieldname: string;
  originalname: string;
  filename: string;
  path: string;
  mimetype: string;
  buffer?: Buffer;
  size?: number;
}

const imageFilter = (
  _req: unknown,
  file: MulterFile,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = extname(file.originalname).toLowerCase();
  if (allowed.test(ext) && file.mimetype?.toLowerCase().startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException('Chỉ cho phép file ảnh (jpg, png, webp).'),
      false,
    );
  }
};

async function optimizeImageToWebp(
  input: Buffer,
  maxWidth = 1920,
  quality = 80,
): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality })
    .toBuffer();
}

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 20,
        fields: 10,
        fieldSize: 1024 * 1024,
      },
      fileFilter: imageFilter,
    }),
  )
  async upload(@UploadedFiles() files: MulterFile[]) {
    if (!files?.length) {
      throw new BadRequestException('Cần ít nhất một file ảnh.');
    }

    fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    const filenames = await Promise.all(
      files.map(async (file) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `gallery-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        const optimized = await optimizeImageToWebp(file.buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return filename;
      }),
    );

    const saved = await this.galleryService.createManyFromFilenames(filenames);
    return saved;
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.remove(id);
  }
}
