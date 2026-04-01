import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { AboutUsService } from './about-us.service';

const UPLOAD_SUBDIR = 'about-us';
const UPLOADS_DIR = join(process.cwd(), '..', 'upload', UPLOAD_SUBDIR);
const MAX_FILE_SIZE = 150 * 1024 * 1024; 

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

type FileFields = {
  image?: MulterFile[];
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

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  findOne() {
    return this.aboutUsService.findOne();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 10,
        fieldSize: 1024 * 1024,
      },
      fileFilter: imageFilter,
    }),
  )
  async save(
    @Body('description') description: string | undefined,
    @UploadedFiles() files: FileFields,
  ) {
    const current = await this.aboutUsService.findOne();

    const getUrl = async (
      arr: MulterFile[] | undefined,
      existing: string | null,
    ): Promise<string | null> => {
      if (arr?.[0]) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `about-us-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        console.log('Saving file at: ', outputPath);
        const optimized = await optimizeImageToWebp(arr[0].buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `upload/${UPLOAD_SUBDIR}/${filename}`;
      }
      return existing ?? null;
    };

    const image_url = await getUrl(files.image, current?.image_url ?? null);

    return this.aboutUsService.save({
      description: description ?? current?.description ?? null,
      image_url,
    });
  }
}
