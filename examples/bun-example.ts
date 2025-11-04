import { createClient } from '../src';

// Bun automatically loads .env files - no need for dotenv package!
// Just create a .env file with: BOT_API_TOKEN=your_token_here

if (!process.env.BOT_API_TOKEN) {
  console.error('Error: BOT_API_TOKEN not found in environment');
  console.error('Create a .env file with: BOT_API_TOKEN=your_token_here');
  process.exit(1);
}

// Bun-specific optimizations
const client = createClient({
  apiToken: process.env.BOT_API_TOKEN,
  // You can also use Bun.env (same as process.env)
  // apiToken: Bun.env.BOT_API_TOKEN,
});

// Bun's fast fetch implementation
console.log('Using Bun runtime for maximum performance');

const startTime = performance.now();

// Parallel requests with Bun's optimized Promise handling
const [exchangeRates, depositRates, loanRates] = await Promise.all([
  client.exchangeRate.daily({
    startPeriod: '2025-01-01',
    endPeriod: '2025-01-31',
  }),
  client.depositRate.rates({
    startPeriod: '2025-01-01',
    endPeriod: '2025-01-31',
  }),
  client.loanRate.rates({
    startPeriod: '2025-01-01',
    endPeriod: '2025-01-31',
  }),
]);

const endTime = performance.now();

console.log(`Fetched 3 endpoints in ${(endTime - startTime).toFixed(2)}ms`);
console.log('Exchange rate avg:', exchangeRates.average('rate'));
console.log('Deposit rate avg:', depositRates.average('rate'));
console.log('Loan rate avg:', loanRates.average('rate'));

// Bun's built-in SQLite for caching (optional)
// import { Database } from 'bun:sqlite';
// const db = new Database('cache.db');
// ... implement caching logic
