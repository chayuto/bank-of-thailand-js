import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface FinancialHolidaysParams {
  year: string;
}

export class FinancialHolidays extends Resource {
  private static readonly BASE_URL =
    'https://gateway.api.bot.or.th/Stat-FinancialInstitutionsHolidays/v1';

  /**
   * Get financial institutions holidays
   * @param params - Year parameter (YYYY format)
   * @returns Response with holiday data
   */
  async list(params: FinancialHolidaysParams): Promise<BotApiResponse> {
    return this.get(`${FinancialHolidays.BASE_URL}/holidays`, {
      year: params.year,
    });
  }
}
