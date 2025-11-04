# bank-of-thailand-js

> TypeScript/JavaScript client for Bank of Thailand API - Works with Node.js, Bun, and browsers

[![NPM Version](https://img.shields.io/npm/v/bank-of-thailand)](https://www.npmjs.com/package/bank-of-thailand)
[![License](https://img.shields.io/npm/l/bank-of-thailand)](https://github.com/chayuto/bank-of-thailand-js/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

Modern, type-safe client for the Bank of Thailand API with built-in analytics, CSV export, and universal runtime support (Node.js 20+, Bun 1.3+, browsers).

## Features

- ✅ **11 API Resources** - Complete BOT API coverage
- ✅ **Rich Analytics** - Built-in statistics, change analysis, volatility calculations
- ✅ **CSV Export** - Save data to CSV (Node.js) or download in browser
- ✅ **Type-Safe** - Full TypeScript 5.7 support with excellent IntelliSense
- ✅ **Universal** - Works in Node.js, Bun, Deno, and browsers
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **Modern Stack** - Built with 2025 best practices

## Installation

```bash
# npm
npm install bank-of-thailand

# pnpm (recommended)
pnpm add bank-of-thailand

# yarn
yarn add bank-of-thailand

# bun
bun add bank-of-thailand
```

## Quick Start

### 1. Get API Token

Get your API token from [BOT API Portal](https://portal.api.bot.or.th)

### 2. Set Up Environment

**Create `.env` file:**
```env
BOT_API_TOKEN=your_api_token_here
```

**For Bun:** `.env` files are automatically loaded (no package needed)

**For Node.js:** Install dotenv:
```bash
npm install dotenv
```

Then import at the top of your file:
```typescript
import 'dotenv/config';
```

**Or use Node.js 20.6+ built-in:**
```bash
node --env-file=.env your-script.js
```

### 3. Use the Client

```typescript
import { createClient } from 'bank-of-thailand';

// Bun: .env automatically loaded
// Node.js: Make sure to import 'dotenv/config' first

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN,
});

// Fetch exchange rates
const rates = await client.exchangeRate.daily({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});

// Use built-in analytics
console.log('Average:', rates.average('rate'));
console.log('Trend:', rates.trend('rate'));
console.log('Volatility:', rates.volatility('rate'));

// Export to CSV
await rates.saveCSV('rates.csv');
```

## API Resources

### 1. Exchange Rate

```typescript
// Daily weighted-average interbank exchange rate
const daily = await client.exchangeRate.daily({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});

// Monthly, quarterly, annual
const monthly = await client.exchangeRate.monthly({ ... });
const quarterly = await client.exchangeRate.quarterly({ ... });
const annual = await client.exchangeRate.annual({ ... });
```

### 2. Average Exchange Rate

```typescript
const avgRates = await client.averageExchangeRate.daily({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});
```

See [full documentation](docs/api-resources.md) for all 11 API resources.

## Response Analytics

All API responses include powerful analytics methods:

```typescript
const rates = await client.exchangeRate.daily({ ... });

// Statistics
rates.min('rate');        // Minimum value
rates.max('rate');        // Maximum value
rates.average('rate');    // Average (mean)
rates.sum('rate');        // Sum of all values

// Change Analysis
const change = rates.change('rate');
console.log(change.percentage);  // Percentage change
console.log(change.absolute);    // Absolute change

// Volatility
const vol = rates.volatility('rate');

// Trend Detection
const trend = rates.trend('rate');  // 'up' | 'down' | 'flat'

// CSV Export
await rates.saveCSV('rates.csv');
```

See [Analytics Guide](docs/analytics.md) for complete documentation.

## Error Handling

```typescript
import { 
  AuthenticationError,
  RateLimitError,
  NotFoundError 
} from 'bank-of-thailand';

try {
  const rates = await client.exchangeRate.daily({ ... });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API token');
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter}s`);
  }
}
```

## Environment Configuration

The library requires an API token which should be loaded from environment variables for security.

**Quick Setup:**
1. Copy `.env.example` to `.env`
2. Add your token: `BOT_API_TOKEN=your_token_here`
3. **Bun:** Auto-loaded ✅ | **Node.js:** Use `dotenv` or `--env-file`

**See the complete [Environment Variables Guide](docs/guides/environment-variables.md)** for:
- Node.js, Bun, Deno setup
- Production deployment (Docker, Kubernetes, AWS, Vercel, etc.)
- Best practices and security tips
- Troubleshooting common issues

## Requirements

- **Node.js**: 20.0.0 or higher
- **Bun**: 1.3.0 or higher
- **Browsers**: Modern browsers with native fetch support

## Development

Built with the 2025 modern stack:

- **Bun Test** - 35x faster than Jest
- **Biome** - All-in-one formatter & linter
- **tsup** - Fast TypeScript bundler
- **pnpm** - Efficient package management

```bash
# Install dependencies
pnpm install

# Run tests
bun test

# Build
pnpm build

# Lint and format
pnpm lint:fix
```

## License

MIT

## Links

- [BOT API Portal](https://portal.api.bot.or.th)
- [Documentation](https://github.com/chayuto/bank-of-thailand-js)
- [npm Package](https://www.npmjs.com/package/bank-of-thailand)

---

**Built with the 2025 modern JavaScript stack**
