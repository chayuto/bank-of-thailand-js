import type { BotApiResponse } from '../response';
import { Resource } from '../resource';

export interface DebtSecuritiesParams {
  startPeriod: string;
  endPeriod: string;
}

export class DebtSecurities extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-DebtSecuritiesAuctionResult/v2';

  /**
   * Get debt securities auction result (current)
   * @param params - Date range parameters
   * @returns Response with debt securities auction data
   */
  async auctionResults(params: DebtSecuritiesParams): Promise<BotApiResponse> {
    return this.get(`${DebtSecurities.BASE_URL}/DAILY_DEBT_SEC_AUCTION/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
