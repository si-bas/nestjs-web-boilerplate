import { AppConfigModule } from './config/app-config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/services/app-config.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        type: appConfigService.getDatabase('type'),
        host: appConfigService.getDatabase('host'),
        port: appConfigService.getDatabase('port'),
        username: appConfigService.getDatabase('username'),
        password: appConfigService.getDatabase('password'),
        database: appConfigService.getDatabase('database'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: appConfigService.getDatabase('synchronize'),
        cache: {
          type: appConfigService.getRedis('type'),
          options: appConfigService.getRedis('options'),
          duration: 60000,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
