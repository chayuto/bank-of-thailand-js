import { describe, expect, test } from 'bun:test';
import {
  AuthenticationError,
  BotApiError,
  ConfigurationError,
  NotFoundError,
  RateLimitError,
  RequestError,
  ServerError,
} from '../../src/errors';

describe('Errors', () => {
  test('BotApiError has correct name', () => {
    const error = new BotApiError('Test error');
    expect(error.name).toBe('BotApiError');
    expect(error.message).toBe('Test error');
  });

  test('ConfigurationError extends BotApiError', () => {
    const error = new ConfigurationError('Config error');
    expect(error).toBeInstanceOf(BotApiError);
    expect(error.name).toBe('ConfigurationError');
  });

  test('RequestError stores response', () => {
    const mockResponse = new Response();
    const error = new RequestError('Request failed', mockResponse);
    expect(error.response).toBe(mockResponse);
  });

  test('AuthenticationError extends RequestError', () => {
    const error = new AuthenticationError('Auth failed');
    expect(error).toBeInstanceOf(RequestError);
    expect(error.name).toBe('AuthenticationError');
  });

  test('RateLimitError stores retryAfter', () => {
    const error = new RateLimitError('Rate limited', undefined, 120);
    expect(error.retryAfter).toBe(120);
  });

  test('RateLimitError has default retryAfter', () => {
    const error = new RateLimitError('Rate limited');
    expect(error.retryAfter).toBe(60);
  });

  test('NotFoundError extends RequestError', () => {
    const error = new NotFoundError('Not found');
    expect(error).toBeInstanceOf(RequestError);
  });

  test('ServerError extends RequestError', () => {
    const error = new ServerError('Server error');
    expect(error).toBeInstanceOf(RequestError);
  });
});
