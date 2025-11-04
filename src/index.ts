export { BotApiClient, createClient } from './client';
export { Configuration } from './configuration';
export type { BotApiConfig, Logger } from './configuration';
export {
  AuthenticationError,
  BotApiError,
  ConfigurationError,
  NotFoundError,
  RateLimitError,
  RequestError,
  ServerError,
} from './errors';
export { BotApiResponse } from './response';
export type { ChangeResult, StatisticsResult } from './response';
export { Resource } from './resource';

// Export all resource classes
export { AverageExchangeRate } from './resources/average-exchange-rate';
export type { AverageExchangeRateParams } from './resources/average-exchange-rate';
export { DebtSecurities } from './resources/debt-securities';
export type { DebtSecuritiesParams } from './resources/debt-securities';
export { DepositRate } from './resources/deposit-rate';
export type { DepositRateParams } from './resources/deposit-rate';
export { ExchangeRate } from './resources/exchange-rate';
export type { ExchangeRateParams } from './resources/exchange-rate';
export { FinancialHolidays } from './resources/financial-holidays';
export type { FinancialHolidaysParams } from './resources/financial-holidays';
export { ImpliedRate } from './resources/implied-rate';
export type { ImpliedRateParams } from './resources/implied-rate';
export { InterbankRate } from './resources/interbank-rate';
export type { InterbankRateParams } from './resources/interbank-rate';
export { LicenseCheck } from './resources/license-check';
export type { LicenseCheckParams } from './resources/license-check';
export { LoanRate } from './resources/loan-rate';
export type { LoanRateParams } from './resources/loan-rate';
export { SearchSeries } from './resources/search-series';
export type { SearchSeriesParams } from './resources/search-series';
export { SwapPoint } from './resources/swap-point';
export type { SwapPointParams } from './resources/swap-point';
