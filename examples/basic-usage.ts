import { createClient } from '../src';

// For Bun: .env files are automatically loaded
// For Node.js: Install and import dotenv
// import 'dotenv/config';

// Validate environment variable
if (!process.env.BOT_API_TOKEN) {
  throw new Error(
    'BOT_API_TOKEN environment variable is required. ' +
      'Create a .env file with: BOT_API_TOKEN=your_token_here',
  );
}

// Create client with API token from environment
const client = createClient({
  apiToken: process.env.BOT_API_TOKEN,
});

// Example 1: Fetch daily exchange rates
console.log('=== Example 1: Daily Exchange Rates ===');
const rates = await client.exchangeRate.daily({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});

console.log('Average rate:', rates.average('rate'));
console.log('Min rate:', rates.min('rate'));
console.log('Max rate:', rates.max('rate'));
console.log('Trend:', rates.trend('rate'));

// Example 2: Analyze rate changes
console.log('\n=== Example 2: Rate Changes ===');
const change = rates.change('rate');
if (change) {
  console.log(`Rate changed by ${change.percentage.toFixed(2)}%`);
  console.log(`From ${change.firstValue} to ${change.lastValue}`);
}

// Example 3: Export to CSV
console.log('\n=== Example 3: Export to CSV ===');
await rates.saveCSV('exchange-rates.csv');
console.log('Saved to exchange-rates.csv');

// Example 4: Deposit rates with analytics
console.log('\n=== Example 4: Deposit Rates ===');
const deposits = await client.depositRate.rates({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});

console.log('Average deposit rate:', deposits.average('rate')?.toFixed(2), '%');
console.log('Volatility:', deposits.volatility('rate'));

// Example 5: Financial holidays
console.log('\n=== Example 5: Financial Holidays ===');
const holidays = await client.financialHolidays.list({
  year: '2025',
});

console.log('Number of holidays:', holidays.length);
console.log('First holiday:', holidays.first());
