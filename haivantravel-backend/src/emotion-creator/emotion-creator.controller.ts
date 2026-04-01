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
import { EmotionCreatorService } from './emotion-creator.service';

const UPLOAD_SUBDIR = 'emotion-creator';
const UPLOADS_DIR = join(__dirname, '..', '..', '..', 'upload', UPLOAD_SUBDIR);
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
  center_image?: MulterFile[];
  left_image?: MulterFile[];
  right_image?: MulterFile[];
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

@Controller('emotion-creator')
export class EmotionCreatorController {
  constructor(private readonly emotionCreatorService: EmotionCreatorService) {}

  @Get()
  findOne() {
    return this.emotionCreatorService.findOne();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'center_image', maxCount: 1 },
        { name: 'left_image', maxCount: 1 },
        { name: 'right_image', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: MAX_FILE_SIZE,
          files: 3,
          fields: 10,
          fieldSize: 1024 * 1024,
        },
        fileFilter: imageFilter,
      },
    ),
  )
  async save(
    @Body('title') title: string | undefined,
    @Body('description') description: string | undefined,
    @Body('description_detail') description_detail: string | undefined,
    @UploadedFiles() files: FileFields,
  ) {
    const current = await this.emotionCreatorService.findOne();

    // Format URL giống gallery / website-content: path tương đối "uploads/..." (forward slash),
    // hiển thị trong DB dạng chuỗi, frontend dùng bằng cách: apiBase + "/" + image_url
    const getUrl = async (
      arr: MulterFile[] | undefined,
      existing: string | null,
      prefix: string,
    ): Promise<string | null> => {
      if (arr?.[0]) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `emotion-${prefix}-${unique}.webp`;
        const outputPath = join(UPLOADS_DIR, filename);
        const optimized = await optimizeImageToWebp(arr[0].buffer as Buffer);
        await fs.promises.writeFile(outputPath, optimized);
        return `upload/${UPLOAD_SUBDIR}/${filename}`;
      }
      return existing ?? null;
    };

    const center_image_url = await getUrl(
      files.center_image,
      current?.center_image_url ?? null,
      'center_image',
    );
    const left_image_url = await getUrl(
      files.left_image,
      current?.left_image_url ?? null,
      'left_image',
    );
    const right_image_url = await getUrl(
      files.right_image,
      current?.right_image_url ?? null,
      'right_image',
    );

    return this.emotionCreatorService.save({
      center_image_url,
      left_image_url,
      right_image_url,
      title: title ?? current?.title ?? null,
      description: description ?? current?.description ?? null,
      description_detail:
        description_detail ?? current?.description_detail ?? null,
    });
  }
}
