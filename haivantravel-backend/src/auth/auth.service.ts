import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private adminsService: AdminsService) {}
  async login(username: string, password: string) {
    const users = await this.adminsService.findByUsername(username);

    console.log('username request:', username);
    console.log('username founded:', users);

    if (!users) {
      throw new UnauthorizedException('Invalid username');
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      message: 'Login success',
      user: {
        id: users.id,
        username: users.username,
      },
    };
  }
}
