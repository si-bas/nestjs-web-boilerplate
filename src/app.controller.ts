import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthExceptionFilter } from './auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from './auth/common/guards/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@UseFilters(AuthExceptionFilter)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
