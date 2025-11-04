export interface StatisticsResult {
  min: number;
  max: number;
  sum: number;
  average: number;
  count: number;
  stdDev: number;
}

export interface ChangeResult {
  absolute: number;
  percentage: number;
  firstValue: number;
  lastValue: number;
}

// biome-ignore lint/suspicious/noExplicitAny: Response data structure is dynamic and determined by API
export class BotApiResponse<T = any> {
  public raw: T;
  // biome-ignore lint/suspicious/noExplicitAny: Data array contains dynamic API response objects
  public data: any[];

  constructor(rawResponse: T) {
    this.raw = rawResponse;
    this.data = this.extractData(rawResponse);
  }

  get length(): number {
    return this.data.length;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Return type depends on API response structure
  first(): any {
    return this.data[0];
  }

  // biome-ignore lint/suspicious/noExplicitAny: Return type depends on API response structure
  last(): any {
    return this.data[this.data.length - 1];
  }

  valuesFor(column: string): number[] {
    return this.data
      .filter((row) => typeof row === 'object' && row !== null)
      .map((row) => Number.parseFloat(row[column]))
      .filter((val) => !Number.isNaN(val));
  }

  min(column: string): number | null {
    const values = this.valuesFor(column);
    return values.length > 0 ? Math.min(...values) : null;
  }

  max(column: string): number | null {
    const values = this.valuesFor(column);
    return values.length > 0 ? Math.max(...values) : null;
  }

  sum(column: string): number {
    return this.valuesFor(column).reduce((acc, val) => acc + val, 0);
  }

  average(column: string): number {
    const values = this.valuesFor(column);
    if (values.length === 0) return 0;
    return this.sum(column) / values.length;
  }

  mean(column: string): number {
    return this.average(column);
  }

  dateRange(): [string, string] | null {
    const dates = this.data
      .filter((row) => typeof row === 'object' && row !== null)
      .map((row) => row.period || row.date)
      .filter(Boolean);

    if (dates.length === 0) return null;

    const sorted = dates.sort();
    return [sorted[0], sorted[sorted.length - 1]];
  }

  periodDays(): number {
    const range = this.dateRange();
    if (!range) return 0;

    const start = new Date(range[0]);
    const end = new Date(range[1]);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  isComplete(): boolean {
    const expected = this.periodDays();
    return expected === 0 ? true : this.data.length >= expected;
  }

  missingDates(): Date[] {
    const range = this.dateRange();
    if (!range) return [];

    const start = new Date(range[0]);
    const end = new Date(range[1]);
    const actualDates = new Set(
      this.data
        .filter((row) => typeof row === 'object' && row !== null)
        .map((row) => row.period || row.date),
    );

    const missing: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (!actualDates.has(dateStr)) {
        missing.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return missing;
  }

  change(column = 'value'): ChangeResult | null {
    const values = this.valuesFor(column);
    if (values.length < 2) return null;

    const firstValue = values[0] as number;
    const lastValue = values[values.length - 1] as number;
    const absolute = lastValue - firstValue;
    const percentage = firstValue === 0 ? 0 : (absolute / firstValue) * 100;

    return {
      absolute: Number.parseFloat(absolute.toFixed(4)),
      percentage: Number.parseFloat(percentage.toFixed(4)),
      firstValue,
      lastValue,
    };
  }

  dailyChanges(column = 'value'): Array<{ absolute: number; percentage: number }> {
    const values = this.valuesFor(column);
    if (values.length < 2) return [];

    const changes: Array<{ absolute: number; percentage: number }> = [];

    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1] as number;
      const curr = values[i] as number;
      const absolute = curr - prev;
      const percentage = prev === 0 ? 0 : (absolute / prev) * 100;

      changes.push({
        absolute: Number.parseFloat(absolute.toFixed(4)),
        percentage: Number.parseFloat(percentage.toFixed(4)),
      });
    }

    return changes;
  }

  volatility(column = 'value'): number {
    const changes = this.dailyChanges(column).map((c) => c.percentage);
    if (changes.length === 0) return 0;

    const mean = changes.reduce((acc, val) => acc + val, 0) / changes.length;
    const variance = changes.reduce((acc, val) => acc + (val - mean) ** 2, 0) / changes.length;

    return Number.parseFloat(Math.sqrt(variance).toFixed(4));
  }

  trend(column = 'value'): 'up' | 'down' | 'flat' {
    const changeData = this.change(column);
    if (!changeData) return 'flat';

    const pct = changeData.percentage;

    if (pct > 1) return 'up';
    if (pct < -1) return 'down';
    return 'flat';
  }

  toCSV(): string {
    if (this.data.length === 0) return '';

    const headers = this.extractHeaders();
    const rows = this.extractRows();

    const csvLines = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => this.escapeCsvCell(cell)).join(',')),
    ];

    return csvLines.join('\n');
  }

  async saveCSV(filename: string): Promise<void> {
    const csv = this.toCSV();

    if (typeof window === 'undefined') {
      const fs = await import('node:fs/promises');
      await fs.writeFile(filename, csv, 'utf-8');
    } else {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: Extracts data from dynamic API response structure
  private extractData(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (typeof response !== 'object' || response === null) return [];

    const result = response.result;
    if (typeof result !== 'object' || result === null) return [];

    const data = result.data;
    if (typeof data !== 'object' || data === null) return [];

    // BOT API returns data in data_detail array
    if (Array.isArray(data.data_detail)) {
      return data.data_detail;
    }

    // Fallback for other possible structures
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }

  private extractHeaders(): string[] {
    if (this.data.length === 0) return [];

    const firstRow = this.data[0];
    if (typeof firstRow !== 'object' || firstRow === null) return [];

    return Object.keys(firstRow);
  }

  private generateCsvContent(): string {
    const headers = this.extractHeaders();
    const rows = this.extractRows();

    const headerRow = headers.map((h) => this.escapeCsvCell(h)).join(',');
    const dataRows = rows.map((row) => row.map((cell) => this.escapeCsvCell(cell)).join(','));

    return [headerRow, ...dataRows].join('\n');
  }

  private extractRows(): unknown[][] {
    return this.data.map((row) => {
      if (typeof row === 'object' && row !== null && !Array.isArray(row)) {
        return Object.values(row);
      }
      if (Array.isArray(row)) {
        return row;
      }
      return [row];
    });
  }

  private escapeCsvCell(cell: unknown): string {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
