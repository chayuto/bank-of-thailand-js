import { describe, expect, test } from 'bun:test';
import { Configuration } from '../../src/configuration';
import { ConfigurationError } from '../../src/errors';

describe('Configuration', () => {
  test('creates valid configuration', () => {
    const config = new Configuration({
      apiToken: 'test-token',
    });

    expect(config.apiToken).toBe('test-token');
    expect(config.baseUrl).toBe('https://gateway.api.bot.or.th');
    expect(config.timeout).toBe(30000);
    expect(config.maxRetries).toBe(3);
  });

  test('accepts custom base URL', () => {
    const config = new Configuration({
      apiToken: 'test-token',
      baseUrl: 'https://custom.api.example.com',
    });

    expect(config.baseUrl).toBe('https://custom.api.example.com');
  });

  test('accepts custom timeout', () => {
    const config = new Configuration({
      apiToken: 'test-token',
      timeout: 60000,
    });

    expect(config.timeout).toBe(60000);
  });

  test('throws error for missing API token', () => {
    expect(() => {
      new Configuration({
        apiToken: '',
      });
    }).toThrow(ConfigurationError);
  });

  test('throws error for empty API token', () => {
    expect(() => {
      new Configuration({
        apiToken: '   ',
      });
    }).toThrow(ConfigurationError);
  });
});
