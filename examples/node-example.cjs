// Node.js CommonJS example

// Load environment variables (uncomment if needed)
// require('dotenv').config();

const { createClient } = require('@bot-api/client');

async function main() {
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
}

main().catch(console.error);
