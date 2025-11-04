# Environment Variables Guide

## Overview

The BOT API client requires an API token for authentication. This guide shows how to securely load environment variables in different environments.

## Node.js

### 1. Using dotenv (Recommended)

**Install dotenv:**
```bash
npm install dotenv
# or
bun add dotenv
```

**Create `.env` file:**
```env
BOT_API_TOKEN=your_api_token_here
```

**Load in your code:**
```typescript
import 'dotenv/config';
import { createClient } from '@bot-api/client';

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN!,
});
```

### 2. Using Node.js built-in (Node.js 20.6+)

Node.js 20.6+ has built-in support for `.env` files:

```bash
node --env-file=.env your-script.js
```

**Your script:**
```typescript
import { createClient } from '@bot-api/client';

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN!,
});
```

### 3. Direct process.env

**Set environment variable:**
```bash
export BOT_API_TOKEN=your_token_here
node your-script.js
```

**Or inline:**
```bash
BOT_API_TOKEN=your_token node your-script.js
```

## Bun

Bun has **built-in** `.env` file support - no package needed!

**Create `.env` file:**
```env
BOT_API_TOKEN=your_api_token_here
```

**Use directly:**
```typescript
import { createClient } from '@bot-api/client';

// Bun automatically loads .env files
const client = createClient({
  apiToken: process.env.BOT_API_TOKEN!,
  // or use Bun.env (same as process.env)
  // apiToken: Bun.env.BOT_API_TOKEN!,
});
```

**Run:**
```bash
bun run your-script.ts
```

## Deno

**Create `.env` file:**
```env
BOT_API_TOKEN=your_api_token_here
```

**Use with deno run:**
```bash
deno run --allow-env --allow-net --env your-script.ts
```

**Your script:**
```typescript
import { createClient } from '@bot-api/client';

const client = createClient({
  apiToken: Deno.env.get('BOT_API_TOKEN')!,
});
```

## Production Environments

### Docker

**Dockerfile:**
```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "run", "index.ts"]
```

**Pass env at runtime:**
```bash
docker run -e BOT_API_TOKEN=your_token your-image
```

**Or use docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - BOT_API_TOKEN=${BOT_API_TOKEN}
    # or use env_file:
    env_file:
      - .env
```

### Kubernetes

**Create secret:**
```bash
kubectl create secret generic bot-api-secret \
  --from-literal=BOT_API_TOKEN=your_token
```

**Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bot-api-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: your-image
        env:
        - name: BOT_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: bot-api-secret
              key: BOT_API_TOKEN
```

### Cloud Platforms

#### Vercel
```bash
vercel env add BOT_API_TOKEN
```

#### Netlify
```bash
netlify env:set BOT_API_TOKEN your_token
```

#### AWS Lambda
Use AWS Systems Manager Parameter Store or Secrets Manager:
```typescript
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: 'us-east-1' });
const response = await ssm.send(
  new GetParameterCommand({
    Name: '/app/BOT_API_TOKEN',
    WithDecryption: true,
  })
);

const client = createClient({
  apiToken: response.Parameter!.Value!,
});
```

## Best Practices

### 1. Never commit .env files

**Add to `.gitignore`:**
```gitignore
.env
.env.local
.env.*.local
```

### 2. Provide .env.example

**Create `.env.example`:**
```env
# Bank of Thailand API Token
# Get yours from https://portal.api.bot.or.th
BOT_API_TOKEN=your_token_here

# Optional: Custom base URL
# BOT_BASE_URL=https://gateway.api.bot.or.th

# Optional: Request timeout (milliseconds)
# BOT_TIMEOUT=30000
```

### 3. Validate environment variables

```typescript
import { createClient } from '@bot-api/client';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const client = createClient({
  apiToken: getEnvVar('BOT_API_TOKEN'),
  baseUrl: process.env.BOT_BASE_URL,
  timeout: process.env.BOT_TIMEOUT 
    ? parseInt(process.env.BOT_TIMEOUT) 
    : undefined,
});
```

### 4. Use type-safe env with Zod (Advanced)

```typescript
import { z } from 'zod';
import { createClient } from '@bot-api/client';

const envSchema = z.object({
  BOT_API_TOKEN: z.string().min(1),
  BOT_BASE_URL: z.string().url().optional(),
  BOT_TIMEOUT: z.coerce.number().positive().optional(),
});

const env = envSchema.parse(process.env);

const client = createClient({
  apiToken: env.BOT_API_TOKEN,
  baseUrl: env.BOT_BASE_URL,
  timeout: env.BOT_TIMEOUT,
});
```

## Configuration Options

All configuration options can be set via environment variables:

```env
# Required
BOT_API_TOKEN=your_token_here

# Optional
BOT_BASE_URL=https://gateway.api.bot.or.th
BOT_TIMEOUT=30000
BOT_MAX_RETRIES=3
```

**Use in code:**
```typescript
import { createClient } from '@bot-api/client';

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN!,
  baseUrl: process.env.BOT_BASE_URL,
  timeout: process.env.BOT_TIMEOUT 
    ? parseInt(process.env.BOT_TIMEOUT) 
    : undefined,
  maxRetries: process.env.BOT_MAX_RETRIES 
    ? parseInt(process.env.BOT_MAX_RETRIES) 
    : undefined,
});
```

## Security Tips

1. **Rotate tokens regularly** - Update your API token periodically
2. **Use different tokens** - Use separate tokens for dev/staging/production
3. **Limit token scope** - Request minimum required permissions
4. **Monitor usage** - Track API usage to detect unauthorized access
5. **Encrypt in transit** - Always use HTTPS (enforced by the library)
6. **Secure storage** - Use secrets managers in production

## Troubleshooting

### "API token is required" error

```typescript
// ✅ Good - validates token exists
if (!process.env.BOT_API_TOKEN) {
  throw new Error('BOT_API_TOKEN environment variable is required');
}

const client = createClient({
  apiToken: process.env.BOT_API_TOKEN,
});
```

### Token not loading

```typescript
// Debug: check if env is loaded
console.log('Token exists:', !!process.env.BOT_API_TOKEN);
console.log('Token length:', process.env.BOT_API_TOKEN?.length);

// Don't log the actual token!
```

### Multiple environment files

```typescript
// Load specific env file
import { config } from 'dotenv';

config({ path: '.env.production' });
```

## Examples

See the `/examples` directory for complete working examples:
- `examples/basic-usage.ts` - Simple usage
- `examples/node-example.mjs` - Node.js ESM
- `examples/bun-example.ts` - Bun with built-in env
