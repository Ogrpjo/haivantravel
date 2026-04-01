import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { WebsiteContentService } from './website-content.service';
import { CreateWebsiteContentDto } from './dto/create-website-content.dto';
import { UpdateWebsiteContentDto } from './dto/update-website-content.dto';

const UPLOAD_SUBDIR = 'website-content';

function getUploadPath() {
  return join(process.cwd(), '..', 'upload', UPLOAD_SUBDIR);
}

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

@Controller('website-content')
export class WebsiteContentController {
  constructor(private readonly websiteContentService: WebsiteContentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) throw new BadRequestException('File ảnh là bắt buộc.');

    const dir = getUploadPath();
    fs.mkdirSync(dir, { recursive: true });

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `upload-${unique}.webp`;
    const outputPath = join(dir, filename);
    const optimized = await optimizeImageToWebp(file.buffer as Buffer);
    await fs.promises.writeFile(outputPath, optimized);

    const path = `upload/${UPLOAD_SUBDIR}/${filename}`;
    return { url: path, filename };
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
      fileFilter: imageFilter,
    }),
  )
  async uploadMultiple(@UploadedFiles() files: MulterFile[]) {
    if (!files?.length)
      throw new BadRequestException('Cần ít nhất một file ảnh.');

    const dir = getUploadPath();
    fs.mkdirSync(dir, { recursive: true });

    const urls = await Promise.all(
      files.map(async (file) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `upload-${unique}.webp`;
        const outputPath = join(dir, filename);
        const optimized = await optimizeImageToWebp(file.buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `upload/${UPLOAD_SUBDIR}/${filename}`;
      }),
    );

    return { urls };
  }

  @Post()
  create(@Body() dto: CreateWebsiteContentDto) {
    return this.websiteContentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWebsiteContentDto) {
    return this.websiteContentService.update(Number(id), dto);
  }

  @Get('page/:page')
  findByPage(@Param('page') page: string) {
    return this.websiteContentService.findByPage(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteContentService.findOne(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.websiteContentService.remove(Number(id));
    return { deleted: ok };
  }
}
