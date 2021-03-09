import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { UserResponseInterface } from './interfaces/user-response.interface';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { DefaultResponseInterface } from 'src/config/interfaces/default-response.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entities/user.entity';
import { AppConfigService } from 'src/config/services/app-config.service';
import { CustomAuthGuard } from './common/guards/custom-auth.guard';
import { AppUrlService } from 'src/config/services/app-url.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
    private readonly appUrlService: AppUrlService,
  ) {}

  @Get('login')
  @Render('auth/login')
  loginPage() {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() res: Response) {
    return res.redirect(this.appUrlService.base());
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<UserResponseInterface> {
    return {
      statusCode: 200,
      data: await this.authService.register(registerDto),
    };
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout();
    return res.redirect(this.appUrlService.base());
  }

  @Get('user')
  user(@User() user: UserEntity): DefaultResponseInterface {
    const data = this.appConfigService.replacePropertyValueEncrypted(
      'id',
      user,
    );

    return {
      statusCode: 200,
      data,
    };
  }
}
