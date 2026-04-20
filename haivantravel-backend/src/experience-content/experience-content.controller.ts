import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { ExperienceContentService } from './experience-content.service';

const UPLOAD_SUBDIR = 'experience-content';
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
  if (allowed.test(ext) && file.mimetype?.toLowerCase().startsWith('image/')) cb(null, true);
  else cb(new BadRequestException('Chỉ cho phép file ảnh (jpg, png, webp).'), false);
};

type FileFields = {
  big_image?: MulterFile[];
  small_image_1?: MulterFile[];
  small_image_2?: MulterFile[];
  small_image_3?: MulterFile[];
  small_image_4?: MulterFile[];
};

async function optimizeImageToWebp(input: Buffer, maxWidth = 1920, quality = 80): Promise<Buffer> {
  return sharp(input).rotate().resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' }).webp({ quality }).toBuffer();
}

@Controller('experience-content')
export class ExperienceContentController {
  constructor(private readonly service: ExperienceContentService) {}

  @Get()
  findOne() {
    return this.service.findOne();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'big_image', maxCount: 1 },
        { name: 'small_image_1', maxCount: 1 },
        { name: 'small_image_2', maxCount: 1 },
        { name: 'small_image_3', maxCount: 1 },
        { name: 'small_image_4', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: MAX_FILE_SIZE, files: 5, fields: 30, fieldSize: 1024 * 1024 },
        fileFilter: imageFilter,
      },
    ),
  )
  async save(
    @Body('small_text') small_text: string | undefined,
    @Body('big_text') big_text: string | undefined,
    @Body('description') description: string | undefined,
    @Body('small_image_1_name') small_image_1_name: string | undefined,
    @Body('small_image_2_name') small_image_2_name: string | undefined,
    @Body('small_image_3_name') small_image_3_name: string | undefined,
    @Body('small_image_4_name') small_image_4_name: string | undefined,
    @UploadedFiles() files: FileFields,
  ) {
    const current = await this.service.findOne();
    const getUrl = async (arr: MulterFile[] | undefined, existing: string | null, prefix: string): Promise<string | null> => {
      if (arr?.[0]) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `experience-${prefix}-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        const optimized = await optimizeImageToWebp(arr[0].buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `upload/${UPLOAD_SUBDIR}/${filename}`;
      }
      return existing ?? null;
    };

    const big_image_url = await getUrl(files.big_image, current?.big_image_url ?? null, 'big');
    const small_image_1_url = await getUrl(files.small_image_1, current?.small_image_1_url ?? null, 'small-1');
    const small_image_2_url = await getUrl(files.small_image_2, current?.small_image_2_url ?? null, 'small-2');
    const small_image_3_url = await getUrl(files.small_image_3, current?.small_image_3_url ?? null, 'small-3');
    const small_image_4_url = await getUrl(files.small_image_4, current?.small_image_4_url ?? null, 'small-4');

    return this.service.save({
      small_text: small_text?.trim() ?? undefined,
      big_text: big_text?.trim() ?? undefined,
      description: description?.trim() ?? undefined,
      big_image_url,
      small_image_1_url,
      small_image_1_name: small_image_1_name?.trim() ?? undefined,
      small_image_2_url,
      small_image_2_name: small_image_2_name?.trim() ?? undefined,
      small_image_3_url,
      small_image_3_name: small_image_3_name?.trim() ?? undefined,
      small_image_4_url,
      small_image_4_name: small_image_4_name?.trim() ?? undefined,
    });
  }
}

