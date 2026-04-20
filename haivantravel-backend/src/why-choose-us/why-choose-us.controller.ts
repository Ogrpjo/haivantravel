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
import { WhyChooseUsService } from './why-choose-us.service';

const UPLOAD_SUBDIR = 'why-choose-us';
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

@Controller('why-choose-us')
export class WhyChooseUsController {
  constructor(private readonly service: WhyChooseUsService) {}

  @Get()
  findOne() {
    return this.service.findOne();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 20,
        fieldSize: 1024 * 1024,
      },
      fileFilter: imageFilter,
    }),
  )
  async save(
    @Body('small_text') small_text: string | undefined,
    @Body('big_text') big_text: string | undefined,
    @Body('description') description: string | undefined,
    @Body('tick_1') tick_1: string | undefined,
    @Body('tick_2') tick_2: string | undefined,
    @Body('tick_3') tick_3: string | undefined,
    @Body('tick_4') tick_4: string | undefined,
    @UploadedFiles() files: FileFields,
  ) {
    const current = await this.service.findOne();

    const getUrl = async (
      arr: MulterFile[] | undefined,
      existing: string | null,
    ): Promise<string | null> => {
      if (arr?.[0]) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `why-choose-us-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        const optimized = await optimizeImageToWebp(arr[0].buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `upload/${UPLOAD_SUBDIR}/${filename}`;
      }
      return existing ?? null;
    };

    const image_url = await getUrl(files.image, current?.image_url ?? null);

    return this.service.save({
      image_url,
      small_text: small_text?.trim() ?? undefined,
      big_text: big_text?.trim() ?? undefined,
      description: description?.trim() ?? undefined,
      tick_1: tick_1?.trim() ?? undefined,
      tick_2: tick_2?.trim() ?? undefined,
      tick_3: tick_3?.trim() ?? undefined,
      tick_4: tick_4?.trim() ?? undefined,
    });
  }
}

