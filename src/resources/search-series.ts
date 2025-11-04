import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface SearchSeriesParams {
  keyword?: string;
  category?: string;
}

export class SearchSeries extends Resource {
  private static readonly BASE_URL = 'https://gateway.api.bot.or.th/Stat-SearchSeries/v1';

  /**
   * Search for data series
   * @param params - Search parameters
   * @returns Response with search results
   */
  async search(params?: SearchSeriesParams): Promise<BotApiResponse> {
    return this.get(`${SearchSeries.BASE_URL}/search`, {
      keyword: params?.keyword,
      category: params?.category,
    });
  }
}
