import { ConfigurationError } from './errors';

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface BotApiConfig {
  apiToken: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  logger?: Logger;
}

export class Configuration {
  public apiToken: string;
  public baseUrl: string;
  public timeout: number;
  public maxRetries: number;
  public logger?: Logger;

  static readonly DEFAULT_BASE_URL = 'https://gateway.api.bot.or.th';
  static readonly DEFAULT_TIMEOUT = 30000;
  static readonly DEFAULT_MAX_RETRIES = 3;

  constructor(config: BotApiConfig) {
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl || Configuration.DEFAULT_BASE_URL;
    this.timeout = config.timeout || Configuration.DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries || Configuration.DEFAULT_MAX_RETRIES;
    this.logger = config.logger;

    this.validate();
  }

  validate(): void {
    if (!this.apiToken || this.apiToken.trim() === '') {
      throw new ConfigurationError('API token is required');
    }
    if (!this.baseUrl || this.baseUrl.trim() === '') {
      throw new ConfigurationError('Base URL cannot be empty');
    }
  }
}
