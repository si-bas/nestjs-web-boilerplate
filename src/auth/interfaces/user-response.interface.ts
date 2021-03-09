import { UserEntity } from '../entities/user.entity';

export interface UserResponseInterface {
  statusCode: number;
  message?: string[];
  error?: string;
  data: UserEntity;
}
