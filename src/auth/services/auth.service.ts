import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppConfigService } from 'src/config/services/app-config.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserEntity } from '../entities/user.entity';
import { RoleRepository } from '../repositories/role.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  /**
   * Register new user
   */
  public async register(registerDto: RegisterDto): Promise<UserEntity> {
    const { username, email } = registerDto;
    const userExisting = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    const role = await this.roleRepository.findOne({
      where: {
        name: 'admin',
      },
    });

    if (userExisting)
      throw new ConflictException('Username or email already used');

    const user = this.userRepository.create({ ...registerDto, roles: [role] });
    await user.save();

    return user;
  }

  /**
   * Get user by username
   */
  public async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User not found');
    user.prefix = this.appConfigService.prefix;

    return user;
  }
}
