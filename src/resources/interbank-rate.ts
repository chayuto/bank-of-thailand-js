import type { BotApiResponse } from '../response';
import { Resource } from '../resource';

export interface InterbankRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class InterbankRate extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-InterbankTransactionRates/v2';

  /**
   * Get interbank transaction rates (percent per annum)
   * @param params - Date range parameters
   * @returns Response with interbank rate data
   */
  async rates(params: InterbankRateParams): Promise<BotApiResponse> {
    return this.get(`${InterbankRate.BASE_URL}/DAILY_INTERBANK_TRANS_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
