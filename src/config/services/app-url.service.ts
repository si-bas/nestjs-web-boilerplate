import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppUrlService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get base URL
   */
  public base(uri?: string): string {
    const url = this.configService.get<string>('APP_URL');
    const prefix = this.configService.get<string>('APP_PREFIX');

    const fullUrl = url + prefix + (this.isEmpty(uri) ? '' : '/' + uri);

    return fullUrl.replace(/([^:])(\/\/+)/g, '$1/');
  }

  private isEmpty(str): boolean {
    return !str || 0 === str.length;
  }
}
