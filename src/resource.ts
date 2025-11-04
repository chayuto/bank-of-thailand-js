import type { BotApiClient } from './client';

export abstract class Resource {
  protected client: BotApiClient;

  constructor(client: BotApiClient) {
    this.client = client;
  }

  protected async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    return this.client.get<T>(path, params);
  }

  protected async post<T = any>(
    path: string,
    options?: { body?: any; params?: Record<string, any> },
  ): Promise<T> {
    return this.client.post<T>(path, options);
  }
}
