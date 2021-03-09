import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigDatabaseInterface } from '../interfaces/config-database.interface';
import { ConfigRedisInterface } from '../interfaces/config-redis.interface';
import * as crypto from 'crypto';
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  public readonly prefix: string = this.configService.get<string>('APP_PREFIX');

  public readonly secretKey: string = this.configService.get<string>('APP_KEY');
  private readonly iv: string = this.configService
    .get<string>('APP_IV')
    .slice(0, 16);

  /**
   * Get app name
   */
  public getAppName(): string {
    return this.configService.get<string>('APP_NAME');
  }

  /**
   * Get all database config
   */
  public database(): ConfigDatabaseInterface {
    return {
      type: this.configService.get<string>('DB_CONNECTION'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      database: this.configService.get<string>('DB_DATABASE'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      synchronize: true,
    };
  }

  /**
   * Get all redis config
   */
  public redis(): ConfigRedisInterface {
    return {
      type: 'redis',
      options: {
        host: this.configService.get<string>('REDIS_HOST'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        port: this.configService.get<number>('REDIS_PORT'),
        duration: 5000,
      },
    };
  }

  /**
   * Get sepecific database config
   */
  public getDatabase(key: string): any {
    return this.database()[key];
  }

  /**
   * Get sepecific redis config
   */
  public getRedis(key: string): any {
    return this.redis()[key];
  }

  /**
   * Encrypt text (not for save into database)
   */
  public encrypt(text: string): string {
    let cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey),
      Buffer.from(this.iv),
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  /**
   * Decrypt text
   */
  public decrypt(text: string): string {
    const encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey),
      Buffer.from(this.iv),
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  /**
   * Replace property value base on key
   */
  public replacePropertyValueEncrypted(prevKey, object) {
    const newObject = _.clone(object);

    _.map(object, (val, key) => {
      if (key === prevKey) {
        newObject[key] = this.encrypt(val.toString());
      } else if (typeof val === 'object') {
        newObject[key] = this.replacePropertyValueEncrypted(prevKey, val);
      } else if (_.isArray(val)) {
        newObject[key] = val.map((xval) => {
          return this.replacePropertyValueEncrypted(prevKey, xval);
        });
      }
    });

    return newObject;
  }
}
