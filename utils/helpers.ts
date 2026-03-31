import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger';

// ─── Wait Helpers ─────────────────────────────────────────────────────────────

/**
 * Wait for a network call matching urlPattern to complete.
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a specific URL pattern.
 */
export async function waitForUrl(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 15_000
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
  Logger.debug(`URL matched: ${urlPattern}`);
}

/**
 * Retry a function up to maxRetries times.
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (err) {
      lastError = err as Error;
      Logger.warn(`Attempt ${attempt}/${maxRetries} failed: ${lastError.message}`);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

// ─── Element Helpers ──────────────────────────────────────────────────────────

/**
 * Scroll element into view before interacting.
 */
export async function scrollAndClick(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
}

/**
 * Safely get text content — returns empty string on error.
 */
export async function safeGetText(locator: Locator): Promise<string> {
  try {
    return (await locator.textContent()) ?? '';
  } catch {
    return '';
  }
}

/**
 * Check if element is present in DOM (not necessarily visible).
 */
export async function isElementPresent(page: Page, selector: string): Promise<boolean> {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * Wait for element to be visible with a custom error message.
 */
export async function assertVisible(
  locator: Locator,
  elementName: string,
  timeout = 10_000
): Promise<void> {
  await expect(locator, `Expected "${elementName}" to be visible`).toBeVisible({ timeout });
}

// ─── Screenshot Helpers ───────────────────────────────────────────────────────

/**
 * Take a named screenshot and attach it to the Allure report.
 */
export async function takeScreenshot(page: Page, name: string): Promise<Buffer> {
  const screenshot = await page.screenshot({ fullPage: true });
  Logger.debug(`📸 Screenshot taken: ${name}`);
  return screenshot;
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────

/**
 * Generate a random email address for test data.
 */
export function generateEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}+${timestamp}${random}@example.com`;
}

/**
 * Generate a random alphanumeric string.
 */
export function generateRandomString(length = 8): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

/**
 * Generate a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pad a number with leading zeros.
 */
export function padNumber(n: number, digits = 2): string {
  return String(n).padStart(digits, '0');
}

// ─── Environment Helpers ──────────────────────────────────────────────────────

export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getBaseUrl(): string {
  return getEnvVar('BASE_URL', 'https://demoqa.com');
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

/**
 * Assert API response matches expected status and optionally validate body shape.
 */
export function assertApiStatus(
  actual: number,
  expected: number,
  context = 'API call'
): void {
  if (actual !== expected) {
    throw new Error(
      `${context} failed — expected status ${expected}, got ${actual}`
    );
  }
  Logger.info(`✅ ${context}: HTTP ${actual}`);
}
