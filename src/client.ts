import type { BotApiConfig } from './configuration';
import { Configuration } from './configuration';
import {
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  RequestError,
  ServerError,
} from './errors';
import { AverageExchangeRate } from './resources/average-exchange-rate';
import { DebtSecurities } from './resources/debt-securities';
import { DepositRate } from './resources/deposit-rate';
import { ExchangeRate } from './resources/exchange-rate';
import { FinancialHolidays } from './resources/financial-holidays';
import { ImpliedRate } from './resources/implied-rate';
import { InterbankRate } from './resources/interbank-rate';
import { LicenseCheck } from './resources/license-check';
import { LoanRate } from './resources/loan-rate';
import { SearchSeries } from './resources/search-series';
import { SwapPoint } from './resources/swap-point';
import { BotApiResponse } from './response';

export class BotApiClient {
  private config: Configuration;
  private _exchangeRate?: ExchangeRate;
  private _averageExchangeRate?: AverageExchangeRate;
  private _depositRate?: DepositRate;
  private _loanRate?: LoanRate;
  private _interbankRate?: InterbankRate;
  private _impliedRate?: ImpliedRate;
  private _debtSecurities?: DebtSecurities;
  private _swapPoint?: SwapPoint;
  private _licenseCheck?: LicenseCheck;
  private _financialHolidays?: FinancialHolidays;
  private _searchSeries?: SearchSeries;

  constructor(config: BotApiConfig) {
    this.config = new Configuration(config);
  }

  get exchangeRate(): ExchangeRate {
    if (!this._exchangeRate) {
      this._exchangeRate = new ExchangeRate(this);
    }
    return this._exchangeRate;
  }

  get averageExchangeRate(): AverageExchangeRate {
    if (!this._averageExchangeRate) {
      this._averageExchangeRate = new AverageExchangeRate(this);
    }
    return this._averageExchangeRate;
  }

  get depositRate(): DepositRate {
    if (!this._depositRate) {
      this._depositRate = new DepositRate(this);
    }
    return this._depositRate;
  }

  get loanRate(): LoanRate {
    if (!this._loanRate) {
      this._loanRate = new LoanRate(this);
    }
    return this._loanRate;
  }

  get interbankRate(): InterbankRate {
    if (!this._interbankRate) {
      this._interbankRate = new InterbankRate(this);
    }
    return this._interbankRate;
  }

  get impliedRate(): ImpliedRate {
    if (!this._impliedRate) {
      this._impliedRate = new ImpliedRate(this);
    }
    return this._impliedRate;
  }

  get debtSecurities(): DebtSecurities {
    if (!this._debtSecurities) {
      this._debtSecurities = new DebtSecurities(this);
    }
    return this._debtSecurities;
  }

  get swapPoint(): SwapPoint {
    if (!this._swapPoint) {
      this._swapPoint = new SwapPoint(this);
    }
    return this._swapPoint;
  }

  get licenseCheck(): LicenseCheck {
    if (!this._licenseCheck) {
      this._licenseCheck = new LicenseCheck(this);
    }
    return this._licenseCheck;
  }

  get financialHolidays(): FinancialHolidays {
    if (!this._financialHolidays) {
      this._financialHolidays = new FinancialHolidays(this);
    }
    return this._financialHolidays;
  }

  get searchSeries(): SearchSeries {
    if (!this._searchSeries) {
      this._searchSeries = new SearchSeries(this);
    }
    return this._searchSeries;
  }

  async get<T = BotApiResponse>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  async post<T = BotApiResponse>(
    path: string,
    options?: { body?: unknown; params?: Record<string, unknown> },
  ): Promise<T> {
    return this.request<T>('POST', path, options);
  }

  private async request<T>(
    method: string,
    path: string,
    options?: { body?: unknown; params?: Record<string, unknown> },
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: this.config.apiToken,
          'Content-Type': 'application/json',
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const baseUrl = path.startsWith('http') ? '' : this.config.baseUrl;
    const url = new URL(path, baseUrl || undefined);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      return new BotApiResponse(json) as T;
    }

    switch (response.status) {
      case 401:
        throw new AuthenticationError('Authentication failed. Check your API token.', response);
      case 403:
        throw new AuthenticationError(
          'Access forbidden. Your token may not have permission for this resource.',
          response,
        );
      case 404:
        throw new NotFoundError(`Resource not found: ${response.url}`, response);
      case 429: {
        const retryAfter = Number.parseInt(response.headers.get('retry-after') || '60');
        throw new RateLimitError('Rate limit exceeded', response, retryAfter);
      }
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(`Server error (${response.status})`, response);
      default:
        throw new RequestError(`Unexpected response status: ${response.status}`, response);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error && error.name === 'AbortError') {
      return new RequestError('Request timeout');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new RequestError(`Connection failed: ${error.message}`);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}

export function createClient(config: BotApiConfig): BotApiClient {
  return new BotApiClient(config);
}
