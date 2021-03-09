import { AppConfigService } from './services/app-config.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppUrlService } from './services/app-url.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [AppConfigService, AppUrlService],
  exports: [AppConfigService, AppUrlService],
})
export class AppConfigModule {}
