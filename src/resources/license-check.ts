import { Resource } from '../resource';
import type { BotApiResponse } from '../response';

export interface LicenseCheckParams {
  taxId: string;
}

export class LicenseCheck extends Resource {
  private static readonly BASE_URL = 'https://gateway.api.bot.or.th/BOTLicenseCheckAPI/v1';

  /**
   * Check BOT license status
   * @param params - Tax ID parameters
   * @returns Response with license check data
   */
  async check(params: LicenseCheckParams): Promise<BotApiResponse> {
    return this.get(`${LicenseCheck.BASE_URL}/license-check`, {
      tax_id: params.taxId,
    });
  }
}
