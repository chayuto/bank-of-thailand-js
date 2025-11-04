import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface SwapPointParams {
  startPeriod: string;
  endPeriod: string;
}

export class SwapPoint extends Resource {
  private static readonly BASE_URL = 'https://gateway.api.bot.or.th/Stat-SwapPoint/v2';

  /**
   * Get swap point onshore (in satangs)
   * @param params - Date range parameters
   * @returns Response with swap point data
   */
  async onshore(params: SwapPointParams): Promise<BotApiResponse> {
    return this.get(`${SwapPoint.BASE_URL}/DAILY_SWAP_POINT/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
