import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser({ email });

    if (user && (await compare(password, user.password)) && user.status) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(data: UserEntity) {
    const { id } = data;
    const payload = { sub: id };

    return {
      data,
      accessToken: this.jwtService.sign(payload)
    };
  }
}
