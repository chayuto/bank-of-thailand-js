import type { BotApiClient } from './client';
import type { BotApiResponse } from './response';

export abstract class Resource {
  protected client: BotApiClient;

  constructor(client: BotApiClient) {
    this.client = client;
  }

  protected async get<T = BotApiResponse>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    return this.client.get<T>(path, params);
  }

  protected async post<T = BotApiResponse>(
    path: string,
    options?: { body?: unknown; params?: Record<string, unknown> },
  ): Promise<T> {
    return this.client.post<T>(path, options);
  }
}
