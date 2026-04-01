import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { Gallery } from './gallery.entity';

const UPLOADS_DIR = join(process.cwd(), '..', 'uploads');

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  /**
   * Tạo một record trong galleries cho mỗi filename.
   * Filename là tên file đã lưu trong thư mục /uploads.
   */
  async createManyFromFilenames(filenames: string[]): Promise<Gallery[]> {
    const saved: Gallery[] = [];
    for (const filename of filenames) {
      const imageUrl = `uploads/${filename}`;
      const gallery = this.galleryRepository.create({ image_url: imageUrl });
      saved.push(await this.galleryRepository.save(gallery));
    }
    return saved;
  }

  async findAll(): Promise<Gallery[]> {
    return this.galleryRepository.find({ order: { id: 'DESC' } });
  }

  async remove(id: number): Promise<{ message: string }> {
    const item = await this.galleryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Không tìm thấy ảnh gallery');
    }

    const filename = item.image_url.replace(/^uploads\//, '');
    const filePath = join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.galleryRepository.delete(id);
    return { message: 'Đã xóa ảnh khỏi gallery' };
  }
}
