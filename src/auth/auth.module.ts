import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './common/strategies/local.strategy';
import { SessionSerializer } from './common/session.serializer';
import { RoleRepository } from './repositories/role.repository';
import { AppConfigModule } from 'src/config/app-config.module';
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([UserRepository, RoleRepository]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
