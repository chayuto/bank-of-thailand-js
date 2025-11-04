import type { BotApiResponse } from '../response';
import { Resource } from '../resource';

export interface ExchangeRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class ExchangeRate extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-ReferenceRate/v2';

  /**
   * Get daily weighted-average interbank exchange rate
   * @param params - Date range parameters
   * @returns Response with daily exchange rate data
   *
   * @example
   * ```typescript
   * const rates = await client.exchangeRate.daily({
   *   startPeriod: '2025-01-01',
   *   endPeriod: '2025-01-31'
   * });
   *
   * console.log(rates.average('rate'));
   * ```
   */
  async daily(params: ExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${ExchangeRate.BASE_URL}/DAILY_REF_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get monthly weighted-average interbank exchange rate
   * @param params - Period range in YYYY-MM format
   */
  async monthly(params: ExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${ExchangeRate.BASE_URL}/MONTHLY_REF_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get quarterly weighted-average interbank exchange rate
   * @param params - Period range in YYYY-QN format
   */
  async quarterly(params: ExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${ExchangeRate.BASE_URL}/QUARTERLY_REF_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get annual weighted-average interbank exchange rate
   * @param params - Year range in YYYY format
   */
  async annual(params: ExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${ExchangeRate.BASE_URL}/ANNUAL_REF_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
