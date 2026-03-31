import { test as setup } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Global setup — runs once before any test project.
 *
 * Use this to:
 *  - Verify the target URL is reachable
 *  - Seed any required test data
 *  - Save authenticated state (storageState)
 */

setup('Global setup: verify environment', async ({ page }) => {
  Logger.info('🌍 Running global setup…');
  Logger.info(`Base URL: ${process.env.BASE_URL ?? 'https://demoqa.com'}`);
  Logger.info(`Environment: ${process.env.ENV ?? 'dev'}`);

  // Verify the site is reachable
  const response = await page.goto(process.env.BASE_URL ?? 'https://demoqa.com', {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });

  if (response && !response.ok() && response.status() !== 304) {
    Logger.warn(`⚠️  Base URL returned HTTP ${response.status()}`);
  } else {
    Logger.info('✅ Base URL is reachable');
  }

  Logger.info('✅ Global setup complete');
});
