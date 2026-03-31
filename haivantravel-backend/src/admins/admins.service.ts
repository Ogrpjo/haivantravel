import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private userRepo: Repository<Admin>,
  ) {}

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }
}
