/**
 * Environment Configuration Example
 *
 * This example shows best practices for loading environment variables
 * in different runtime environments.
 */

import { createClient } from '../src';

// ============================================================================
// Option 1: Basic validation (recommended for all projects)
// ============================================================================

function loadBasicConfig() {
  if (!process.env.BOT_API_TOKEN) {
    throw new Error(
      'BOT_API_TOKEN is required. Please set it in your .env file:\n' +
        '  BOT_API_TOKEN=your_token_here\n\n' +
        'Get your token from: https://portal.api.bot.or.th',
    );
  }

  return createClient({
    apiToken: process.env.BOT_API_TOKEN,
    baseUrl: process.env.BOT_BASE_URL,
    timeout: process.env.BOT_TIMEOUT ? Number.parseInt(process.env.BOT_TIMEOUT) : undefined,
    maxRetries: process.env.BOT_MAX_RETRIES
      ? Number.parseInt(process.env.BOT_MAX_RETRIES)
      : undefined,
  });
}

// ============================================================================
// Option 2: Helper function for required env vars
// ============================================================================

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

function getNumberEnv(name: string, defaultValue?: number): number | undefined {
  const value = process.env[name];
  if (!value) return defaultValue;

  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) {
    throw new Error(`Environment variable ${name} must be a number, got: ${value}`);
  }
  return num;
}

function loadConfigWithHelpers() {
  return createClient({
    apiToken: getRequiredEnv('BOT_API_TOKEN'),
    baseUrl: getOptionalEnv('BOT_BASE_URL'),
    timeout: getNumberEnv('BOT_TIMEOUT', 30000),
    maxRetries: getNumberEnv('BOT_MAX_RETRIES', 3),
  });
}

// ============================================================================
// Option 3: Type-safe config with validation (advanced)
// ============================================================================

interface AppConfig {
  botApiToken: string;
  botBaseUrl?: string;
  botTimeout: number;
  botMaxRetries: number;
}

function validateConfig(): AppConfig {
  const config: AppConfig = {
    botApiToken: getRequiredEnv('BOT_API_TOKEN'),
    botBaseUrl: getOptionalEnv('BOT_BASE_URL'),
    botTimeout: getNumberEnv('BOT_TIMEOUT', 30000) ?? 30000,
    botMaxRetries: getNumberEnv('BOT_MAX_RETRIES', 3) ?? 3,
  };

  // Additional validation
  if (config.botTimeout < 1000) {
    throw new Error('BOT_TIMEOUT must be at least 1000ms');
  }

  if (config.botMaxRetries < 0 || config.botMaxRetries > 10) {
    throw new Error('BOT_MAX_RETRIES must be between 0 and 10');
  }

  return config;
}

function loadTypeSafeConfig() {
  const config = validateConfig();

  return createClient({
    apiToken: config.botApiToken,
    baseUrl: config.botBaseUrl,
    timeout: config.botTimeout,
    maxRetries: config.botMaxRetries,
  });
}

// ============================================================================
// Option 4: Different configs for different environments
// ============================================================================

type Environment = 'development' | 'staging' | 'production';

function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'development' && env !== 'staging' && env !== 'production') {
    throw new Error(`Invalid NODE_ENV: ${env}`);
  }
  return env as Environment;
}

function loadEnvironmentConfig() {
  const env = getEnvironment();

  // Different timeouts for different environments
  const timeouts = {
    development: 60000, // 60s for debugging
    staging: 30000, // 30s
    production: 10000, // 10s for production
  };

  return createClient({
    apiToken: getRequiredEnv('BOT_API_TOKEN'),
    timeout: timeouts[env],
    logger: env === 'development' ? console : undefined,
  });
}

// ============================================================================
// Usage Examples
// ============================================================================

async function main() {
  console.log('Environment Configuration Examples\n');

  // Example 1: Basic
  console.log('1. Basic configuration:');
  try {
    loadBasicConfig();
    console.log('✓ Client created successfully');
  } catch (error) {
    console.error('✗ Error:', (error as Error).message);
  }

  // Example 2: With helpers
  console.log('\n2. Configuration with helpers:');
  try {
    loadConfigWithHelpers();
    console.log('✓ Client created with validated config');
  } catch (error) {
    console.error('✗ Error:', (error as Error).message);
  }

  // Example 3: Type-safe
  console.log('\n3. Type-safe configuration:');
  try {
    loadTypeSafeConfig();
    console.log('✓ Client created with type-safe config');
  } catch (error) {
    console.error('✗ Error:', (error as Error).message);
  }

  // Example 4: Environment-specific
  console.log('\n4. Environment-specific configuration:');
  console.log('   Current environment:', process.env.NODE_ENV || 'development');
  try {
    loadEnvironmentConfig();
    console.log('✓ Client created with environment config');
  } catch (error) {
    console.error('✗ Error:', (error as Error).message);
  }

  // Show current environment variables (without exposing the token)
  console.log('\nEnvironment variables:');
  console.log('  BOT_API_TOKEN:', process.env.BOT_API_TOKEN ? '✓ Set' : '✗ Not set');
  console.log('  BOT_BASE_URL:', process.env.BOT_BASE_URL || '(using default)');
  console.log('  BOT_TIMEOUT:', process.env.BOT_TIMEOUT || '(using default)');
  console.log('  BOT_MAX_RETRIES:', process.env.BOT_MAX_RETRIES || '(using default)');
}

// Run if executed directly
if (import.meta.main) {
  main().catch(console.error);
}

// Export functions for use in other modules
export {
  loadBasicConfig,
  loadConfigWithHelpers,
  loadTypeSafeConfig,
  loadEnvironmentConfig,
  getRequiredEnv,
  getOptionalEnv,
  getNumberEnv,
};
