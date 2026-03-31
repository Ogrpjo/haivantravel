/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { BlogDetailsService } from './blog-details.service';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';

type UploadFileLike = {
  originalname?: string;
  mimetype?: string;
  path?: string;
};

const asUploadFile = (file: unknown): UploadFileLike => {
  if (typeof file === 'object' && file !== null) {
    return file as UploadFileLike;
  }
  return {};
};

@Controller('blog-details')
export class BlogDetailsController {
  constructor(private readonly blogDetailsService: BlogDetailsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('demo_image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const uploadFile = asUploadFile(file);
          const fileExt = extname(uploadFile.originalname ?? '');
          cb(null, `blog-demo-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const uploadFile = asUploadFile(file);
        const ext = extname(uploadFile.originalname ?? '').toLowerCase();
        const mimetype = (uploadFile.mimetype ?? '').toLowerCase();

        if (allowedTypes.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: unknown,
    @Body() body: Record<string, unknown>,
  ) {
    const uploadFile = asUploadFile(file);
    if (!uploadFile.path) {
      throw new BadRequestException('Demo image is required.');
    }

    const title = typeof body.title === 'string' ? body.title : '';
    const slug = typeof body.slug === 'string' ? body.slug : '';
    const type = typeof body.type === 'string' ? body.type : undefined;
    const content = typeof body.content === 'string' ? body.content : undefined;
    const metaTitle =
      typeof body.meta_title === 'string' ? body.meta_title : undefined;
    const metaKeywords =
      typeof body.meta_keywords === 'string' ? body.meta_keywords : undefined;
    const metaDescription =
      typeof body.meta_description === 'string'
        ? body.meta_description
        : undefined;

    if (!title || !slug) {
      throw new BadRequestException('Title and slug are required.');
    }

    const demoImagePath = uploadFile.path.replace(/\\/g, '/');
    return this.blogDetailsService.create({
      title,
      slug,
      type,
      content,
      demo_image: demoImagePath,
      meta_title: metaTitle,
      meta_keywords: metaKeywords,
      meta_description: metaDescription,
    } as CreateBlogDetailDto);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('demo_image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const uploadFile = asUploadFile(file);
          const fileExt = extname(uploadFile.originalname ?? '');
          cb(null, `blog-demo-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const uploadFile = asUploadFile(file);
        const ext = extname(uploadFile.originalname ?? '').toLowerCase();
        const mimetype = (uploadFile.mimetype ?? '').toLowerCase();

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
    @UploadedFile() file: unknown,
    @Body() body: Record<string, unknown>,
  ) {
    const title = typeof body.title === 'string' ? body.title : undefined;
    const slug = typeof body.slug === 'string' ? body.slug : undefined;
    const type = typeof body.type === 'string' ? body.type : undefined;
    const content = typeof body.content === 'string' ? body.content : undefined;
    const metaTitle =
      typeof body.meta_title === 'string' ? body.meta_title : undefined;
    const metaKeywords =
      typeof body.meta_keywords === 'string' ? body.meta_keywords : undefined;
    const metaDescription =
      typeof body.meta_description === 'string'
        ? body.meta_description
        : undefined;

    const payload: Partial<CreateBlogDetailDto> & { demo_image?: string } = {};
    if (title) payload.title = title;
    if (slug) payload.slug = slug;
    if (type !== undefined) payload.type = type;
    if (content !== undefined) payload.content = content;
    if (metaTitle !== undefined) payload.meta_title = metaTitle;
    if (metaKeywords !== undefined) payload.meta_keywords = metaKeywords;
    if (metaDescription !== undefined) {
      payload.meta_description = metaDescription;
    }

    const uploadFile = asUploadFile(file);
    if (uploadFile.path) {
      payload.demo_image = uploadFile.path.replace(/\\/g, '/');
    }

    const updated = await this.blogDetailsService.update(Number(id), payload);
    if (!updated) throw new NotFoundException('Blog not found');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.blogDetailsService.remove(Number(id));
    if (!deleted) throw new NotFoundException('Blog not found');
    return { deleted: true };
  }

  @Get()
  async findAll() {
    return this.blogDetailsService.findAll();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const detail = await this.blogDetailsService.findBySlug(slug);
    if (!detail) throw new NotFoundException('Blog not found');
    return detail;
  }
}
