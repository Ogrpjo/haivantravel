import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './statistics.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    return this.statisticsRepository.find({ order: { id: 'ASC' } });
  }

  /** Xóa toàn bộ record cũ, lưu danh sách mới (mỗi item = 1 record). */
  async saveAll(
    items: { title: string; number: string }[],
  ): Promise<Statistics[]> {
    await this.statisticsRepository.clear();
    const entities = items.map((item) =>
      this.statisticsRepository.create({
        title: item.title.trim(),
        number: item.number.trim(),
      }),
    );
    return this.statisticsRepository.save(entities);
  }
}
