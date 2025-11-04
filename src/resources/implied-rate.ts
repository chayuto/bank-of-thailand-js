import type { BotApiResponse } from '../response';
import { Resource } from '../resource';

export interface ImpliedRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class ImpliedRate extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-ImpliedInterestRates/v2';

  /**
   * Get Thai Baht implied interest rates (percent per annum)
   * @param params - Date range parameters
   * @returns Response with implied rate data
   */
  async rates(params: ImpliedRateParams): Promise<BotApiResponse> {
    return this.get(`${ImpliedRate.BASE_URL}/DAILY_IMPLIED_INT_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
