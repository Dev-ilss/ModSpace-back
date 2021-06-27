import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { User, Auth } from 'src/common/decorators';
import { UserEntity } from '../user/entities';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos';

@ApiTags('Sessions')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @User()
    data: UserEntity
  ) {
    const user = await this.authService.login(data);
    const { accessToken, ...rest } = user;
    return {
      success: true,
      message: 'Login successfully',
      ...rest,
      token: accessToken
    };
  }

  @Auth()
  @Get('profile')
  profile(
    @User()
    user: UserEntity
  ): any {
    return {
      success: true,
      message: 'Welcome...',
      user
    };
  }

  @Auth()
  @Get('refresh')
  async refreshToken(
    @User()
    data: UserEntity
  ): Promise<any> {
    const user = await this.authService.login(data);
    const { accessToken, ...rest } = user;
    return {
      success: true,
      message: '',
      ...rest,
      token: accessToken
    };
  }
}
