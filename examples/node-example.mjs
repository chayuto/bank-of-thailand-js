// Node.js ESM example

// Option 1: Use dotenv (recommended for Node.js < 20.6)
// import 'dotenv/config';

// Option 2: Node.js 20.6+ built-in support
// Run with: node --env-file=.env node-example.mjs

import { createClient } from '@bot-api/client';

if (!process.env.BOT_API_TOKEN) {
  throw new Error('BOT_API_TOKEN environment variable is required');
}

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN,
});

const rates = await client.exchangeRate.daily({
  startPeriod: '2025-01-01',
  endPeriod: '2025-01-31',
});

console.log('Average:', rates.average('rate'));
console.log('Data points:', rates.length);
