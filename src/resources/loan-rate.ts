import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface LoanRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class LoanRate extends Resource {
  private static readonly BASE_URL = 'https://gateway.api.bot.or.th/Stat-LoanInterestRates/v2';

  /**
   * Get loan interest rates of commercial banks
   * @param params - Date range parameters
   * @returns Response with loan rate data
   */
  async rates(params: LoanRateParams): Promise<BotApiResponse> {
    return this.get(`${LoanRate.BASE_URL}/DAILY_LOAN_INT_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
