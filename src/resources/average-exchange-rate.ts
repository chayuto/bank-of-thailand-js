import type { BotApiResponse } from '../response';
import { Resource } from '../resource';

export interface AverageExchangeRateParams {
  startPeriod: string;
  endPeriod: string;
}

export class AverageExchangeRate extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-AverageExchangeRate/v2';

  /**
   * Get daily average exchange rate THB to foreign currency
   * @param params - Date range parameters
   * @returns Response with daily average exchange rate data
   */
  async daily(params: AverageExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${AverageExchangeRate.BASE_URL}/DAILY_AVG_EXG_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get monthly average exchange rate THB to foreign currency
   * @param params - Period range in YYYY-MM format
   */
  async monthly(params: AverageExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${AverageExchangeRate.BASE_URL}/MONTHLY_AVG_EXG_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get quarterly average exchange rate THB to foreign currency
   * @param params - Period range in YYYY-QN format
   */
  async quarterly(params: AverageExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${AverageExchangeRate.BASE_URL}/QUARTERLY_AVG_EXG_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }

  /**
   * Get annual average exchange rate THB to foreign currency
   * @param params - Year range in YYYY format
   */
  async annual(params: AverageExchangeRateParams): Promise<BotApiResponse> {
    return this.get(`${AverageExchangeRate.BASE_URL}/ANNUAL_AVG_EXG_RATE/`, {
      start_period: params.startPeriod,
      end_period: params.endPeriod,
    });
  }
}
