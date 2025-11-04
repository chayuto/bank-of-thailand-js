# Quick Start Guide

## Prerequisites

1. **Get BOT API Token**: Register at [BOT API Portal](https://portal.api.bot.or.th)
2. **Node.js 20+** or **Bun 1.3+**

## Setup

### 1. Installation

```bash
bun install
```

### 2. Environment Configuration

**Create `.env` file** (copy from example):

```bash
cp .env.example .env
```

**Edit `.env` and add your token:**

```env
BOT_API_TOKEN=your_actual_token_here
```

**For Bun users:** ✅ Done! Bun automatically loads `.env` files.

**For Node.js users:** Install dotenv:

```bash
npm install dotenv
```

Then add to the top of your scripts:

```typescript
import 'dotenv/config';
```

## Development

### Run Tests

```bash
bun test
```

### Build Library

```bash
bun run build
```

### Lint Code

```bash
bun run lint
```

### Format Code

```bash
bun run format
```

## Try It Out

### Run Examples

```bash
# Make sure .env file has BOT_API_TOKEN set

# Basic usage example
bun examples/basic-usage.ts

# Bun-specific example  
bun examples/bun-example.ts

# Node.js example (if you have Node installed)
node --env-file=.env examples/node-example.mjs
```

## Project Structure

- `src/` - Source code
  - `client.ts` - Main client
  - `resources/` - All 11 API resources
  - `response.ts` - Response wrapper with analytics
- `tests/` - Test files
- `examples/` - Usage examples
- `dist/` - Build output (after running `bun run build`)

## Development Workflow

1. Make changes in `src/`
2. Run tests: `bun test`
3. Build: `bun run build`
4. Test examples: `bun examples/basic-usage.ts`

## Next Steps

1. Get a BOT API token from https://portal.api.bot.or.th
2. Set environment variable: `export BOT_API_TOKEN=your-token`
3. Run examples to test the library
4. Read the full README.md for API documentation
