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
import { CompanyOverviewService } from './company-overview.service';

const UPLOAD_SUBDIR = 'company-overview';
const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads', UPLOAD_SUBDIR);
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB / file

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
  big_image?: MulterFile[];
  small_image?: MulterFile[];
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

@Controller('company-overview')
export class CompanyOverviewController {
  constructor(
    private readonly companyOverviewService: CompanyOverviewService,
  ) {}

  @Get()
  findOne() {
    return this.companyOverviewService.findOne();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'big_image', maxCount: 1 },
        { name: 'small_image', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: MAX_FILE_SIZE,
          files: 2,
          fields: 10,
          fieldSize: 1024 * 1024,
        },
        fileFilter: imageFilter,
      },
    ),
  )
  async save(
    @Body('title') title: string | undefined,
    @Body('description1') description1: string | undefined,
    @Body('description2') description2: string | undefined,
    @UploadedFiles() files: FileFields,
  ) {
    const current = await this.companyOverviewService.findOne();

    const getUrl = async (
      arr: MulterFile[] | undefined,
      existing: string | null,
      prefix: string,
    ): Promise<string | null> => {
      if (arr?.[0]) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `company-${prefix}-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        const optimized = await optimizeImageToWebp(arr[0].buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `uploads/${UPLOAD_SUBDIR}/${filename}`;
      }
      return existing ?? null;
    };

    const big_image_url = await getUrl(
      files.big_image,
      current?.big_image_url ?? null,
      'big_image',
    );
    const small_image_url = await getUrl(
      files.small_image,
      current?.small_image_url ?? null,
      'small_image',
    );

    return this.companyOverviewService.save({
      title: title ?? current?.title ?? null,
      description1: description1 ?? current?.description1 ?? null,
      description2: description2 ?? current?.description2 ?? null,
      big_image_url,
      small_image_url,
    });
  }
}
