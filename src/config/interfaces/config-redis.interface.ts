export interface ConfigRedisInterface {
  type: string;
  options: {
    host: string;
    password: string;
    port: number;
    duration?: number;
  };
}
