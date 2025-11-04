import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface DepositRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class DepositRate extends Resource {
  private static readonly BASE_URL = 'https://gateway.api.bot.or.th/Stat-DepositInterestRates/v2';

  /**
   * Get deposit interest rates for individuals of commercial banks
   * @param params - Date range parameters
   * @returns Response with deposit rate data
   */
  async rates(params: DepositRateParams): Promise<BotApiResponse> {
    return this.get(`${DepositRate.BASE_URL}/DAILY_DEPOSIT_INT_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
