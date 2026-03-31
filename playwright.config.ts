import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const ENV = process.env.ENV || 'dev';
dotenvConfig({ path: path.resolve(__dirname, `./config/.env.${ENV}`) });

export default defineConfig({
  // ─── Test Directory ────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ─── Global Timeouts ───────────────────────────────────────────────────────
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  // ─── Parallelism ───────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,

  // ─── Reporting ─────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-html-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // ─── Global Use ────────────────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://demoqa.com',

    // Capture artefacts on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Browser context
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  // ─── Output ────────────────────────────────────────────────────────────────
  outputDir: 'test-results',

  // ─── Projects (Cross-browser) ──────────────────────────────────────────────
  projects: [
    // ── Setup project (auth state) ──────────────────────────────────────────
    {
      name: 'setup',
      testMatch: '**/global.setup.ts',
    },

    // ── Desktop Chromium ────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // ── Desktop Firefox ─────────────────────────────────────────────────────
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    // ── Desktop WebKit ──────────────────────────────────────────────────────
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // ── Mobile Chrome ───────────────────────────────────────────────────────
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    // ── API Tests (no browser needed) ───────────────────────────────────────
    {
      name: 'api',
      testMatch: '**/api/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://demoqa.com',
      },
    },
  ],
});
