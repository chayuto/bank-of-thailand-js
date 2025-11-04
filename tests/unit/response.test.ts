import { beforeEach, describe, expect, test } from 'bun:test';
import { BotApiResponse } from '../../src/response';

describe('BotApiResponse', () => {
  describe('statistics', () => {
    const mockData = {
      result: {
        data: [
          { period: '2025-01-01', value: '33.50' },
          { period: '2025-01-02', value: '33.60' },
          { period: '2025-01-03', value: '33.55' },
        ],
      },
    };

    let response: BotApiResponse;

    beforeEach(() => {
      response = new BotApiResponse(mockData);
    });

    test('calculates average correctly', () => {
      expect(response.average('value')).toBeCloseTo(33.55, 2);
    });

    test('finds min value', () => {
      expect(response.min('value')).toBe(33.5);
    });

    test('finds max value', () => {
      expect(response.max('value')).toBe(33.6);
    });

    test('calculates change', () => {
      const change = response.change('value');
      expect(change).not.toBeNull();
      if (change) {
        expect(change.absolute).toBeCloseTo(0.05, 2);
        expect(change.percentage).toBeCloseTo(0.149, 2);
      }
    });

    test('returns first and last items', () => {
      expect(response.first().period).toBe('2025-01-01');
      expect(response.last().period).toBe('2025-01-03');
    });

    test('calculates sum', () => {
      expect(response.sum('value')).toBeCloseTo(100.65, 2);
    });

    test('determines trend', () => {
      const trend = response.trend('value');
      expect(trend).toBe('flat');
    });
  });

  describe('CSV export', () => {
    test('generates valid CSV', () => {
      const mockData = {
        result: {
          data: [
            { date: '2025-01-01', rate: 33.5 },
            { date: '2025-01-02', rate: 33.6 },
          ],
        },
      };

      const response = new BotApiResponse(mockData);
      const csv = response.toCSV();

      expect(csv).toContain('date,rate');
      expect(csv).toContain('2025-01-01,33.5');
      expect(csv).toContain('2025-01-02,33.6');
    });

    test('escapes special characters', () => {
      const mockData = {
        result: {
          data: [{ name: 'Test, Inc.', value: '"Special"' }],
        },
      };

      const response = new BotApiResponse(mockData);
      const csv = response.toCSV();

      expect(csv).toContain('"Test, Inc."');
      expect(csv).toContain('"""Special"""');
    });
  });

  describe('date analysis', () => {
    test('calculates date range', () => {
      const mockData = {
        result: {
          data: [
            { period: '2025-01-01', value: '1' },
            { period: '2025-01-05', value: '2' },
          ],
        },
      };

      const response = new BotApiResponse(mockData);
      const range = response.dateRange();

      expect(range).not.toBeNull();
      if (range) {
        expect(range[0]).toBe('2025-01-01');
        expect(range[1]).toBe('2025-01-05');
      }
    });

    test('calculates period days', () => {
      const mockData = {
        result: {
          data: [
            { period: '2025-01-01', value: '1' },
            { period: '2025-01-05', value: '2' },
          ],
        },
      };

      const response = new BotApiResponse(mockData);
      expect(response.periodDays()).toBe(5);
    });
  });

  describe('volatility analysis', () => {
    test('calculates volatility', () => {
      const mockData = {
        result: {
          data: [
            { period: '2025-01-01', value: '100' },
            { period: '2025-01-02', value: '105' },
            { period: '2025-01-03', value: '103' },
            { period: '2025-01-04', value: '108' },
          ],
        },
      };

      const response = new BotApiResponse(mockData);
      const vol = response.volatility('value');
      expect(vol).toBeGreaterThan(0);
    });

    test('calculates daily changes', () => {
      const mockData = {
        result: {
          data: [
            { period: '2025-01-01', value: '100' },
            { period: '2025-01-02', value: '105' },
          ],
        },
      };

      const response = new BotApiResponse(mockData);
      const changes = response.dailyChanges('value');

      expect(changes).toHaveLength(1);
      expect(changes[0].absolute).toBe(5);
      expect(changes[0].percentage).toBe(5);
    });
  });
});
