/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           AI-POWERED TEST GENERATOR UTILITY                     ║
 * ║                                                                  ║
 * ║  Simulates AI-assisted test generation. In a real integration,  ║
 * ║  replace the mock engine with calls to OpenAI / Claude API.     ║
 * ║                                                                  ║
 * ║  Flow:                                                           ║
 * ║    1. Accept a plain-English feature description                 ║
 * ║    2. Parse intent → extract entities, actions, assertions       ║
 * ║    3. Generate typed Playwright test scaffold                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FeatureDescription {
  featureName: string;
  description: string;
  url: string;
  actions: string[];
  assertions: string[];
  tags?: string[];
}

export interface GeneratedTestStep {
  type: 'action' | 'assertion' | 'navigation' | 'wait';
  description: string;
  playwrightCode: string;
}

export interface GeneratedTest {
  fileName: string;
  testTitle: string;
  steps: GeneratedTestStep[];
  imports: string[];
  fullCode: string;
  aiConfidenceScore: number; // 0–100
  generatedAt: string;
}

// ─── Action → Playwright Mapping ────────────────────────────────────────────

const ACTION_PATTERNS: Record<string, (target: string) => string> = {
  click: (t) => `await page.locator('${t}').click();`,
  fill: (t) => `await page.locator('${t}').fill('test_value');`,
  type: (t) => `await page.locator('${t}').type('test_value');`,
  navigate: (t) => `await page.goto('${t}');`,
  select: (t) => `await page.locator('${t}').selectOption('option_value');`,
  check: (t) => `await page.locator('${t}').check();`,
  uncheck: (t) => `await page.locator('${t}').uncheck();`,
  hover: (t) => `await page.locator('${t}').hover();`,
  press: (t) => `await page.keyboard.press('${t}');`,
  wait: (t) => `await page.waitForSelector('${t}');`,
  screenshot: (_t) => `await page.screenshot({ path: 'screenshot.png' });`,
  clear: (t) => `await page.locator('${t}').clear();`,
};

const ASSERTION_PATTERNS: Record<string, (target: string) => string> = {
  visible: (t) => `await expect(page.locator('${t}')).toBeVisible();`,
  hidden: (t) => `await expect(page.locator('${t}')).toBeHidden();`,
  text: (t) => `await expect(page.locator('${t}')).toHaveText('expected_text');`,
  enabled: (t) => `await expect(page.locator('${t}')).toBeEnabled();`,
  disabled: (t) => `await expect(page.locator('${t}')).toBeDisabled();`,
  url: (t) => `await expect(page).toHaveURL('${t}');`,
  title: (t) => `await expect(page).toHaveTitle('${t}');`,
  count: (t) => `await expect(page.locator('${t}')).toHaveCount(1);`,
  value: (t) => `await expect(page.locator('${t}')).toHaveValue('expected_value');`,
  checked: (t) => `await expect(page.locator('${t}')).toBeChecked();`,
};

// ─── NLP-Lite Parser ─────────────────────────────────────────────────────────
// In production, replace this with an LLM API call.

function parseAction(action: string): GeneratedTestStep {
  const lower = action.toLowerCase();

  // Detect action type
  for (const [keyword, codeFn] of Object.entries(ACTION_PATTERNS)) {
    if (lower.includes(keyword)) {
      // Extract potential selector/target from the string
      const target = extractTarget(action) || `[data-testid="${keyword}-element"]`;
      return {
        type: 'action',
        description: action,
        playwrightCode: codeFn(target),
      };
    }
  }

  // Default fallback
  return {
    type: 'action',
    description: action,
    playwrightCode: `// TODO: Implement → ${action}`,
  };
}

function parseAssertion(assertion: string): GeneratedTestStep {
  const lower = assertion.toLowerCase();

  for (const [keyword, codeFn] of Object.entries(ASSERTION_PATTERNS)) {
    if (lower.includes(keyword)) {
      const target = extractTarget(assertion) || `[data-testid="assert-element"]`;
      return {
        type: 'assertion',
        description: assertion,
        playwrightCode: codeFn(target),
      };
    }
  }

  return {
    type: 'assertion',
    description: assertion,
    playwrightCode: `// TODO: Assert → ${assertion}`,
  };
}

function extractTarget(text: string): string | null {
  // Extract quoted strings as potential selectors
  const quotedMatch = text.match(/["'`]([^"'`]+)["'`]/);
  if (quotedMatch) return quotedMatch[1];

  // Extract CSS-like selectors
  const selectorMatch = text.match(/([.#\[][\w-[\]="]+)/);
  if (selectorMatch) return selectorMatch[1];

  return null;
}

function computeConfidenceScore(feature: FeatureDescription): number {
  let score = 50; // base
  if (feature.url) score += 10;
  if (feature.actions.length > 0) score += Math.min(feature.actions.length * 5, 20);
  if (feature.assertions.length > 0) score += Math.min(feature.assertions.length * 5, 15);
  if (feature.tags && feature.tags.length > 0) score += 5;
  return Math.min(score, 100);
}

// ─── Code Builder ────────────────────────────────────────────────────────────

function buildTestCode(feature: FeatureDescription, steps: GeneratedTestStep[]): string {
  const tags = feature.tags?.map((t) => `@${t}`).join(' ') ?? '';
  const actionSteps = steps
    .map((s) => `    // ${s.description}\n    ${s.playwrightCode}`)
    .join('\n\n');

  return `/**
 * ─────────────────────────────────────────────────────────
 * AI-GENERATED TEST: ${feature.featureName}
 * Generated at: ${new Date().toISOString()}
 * AI Confidence: ${computeConfidenceScore(feature)}%
 *
 * ⚠️  Review and refine before running in production.
 * ─────────────────────────────────────────────────────────
 */

import { test, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

test.describe('${feature.featureName} ${tags}', () => {
  test.beforeEach(async ({ page }) => {
    Logger.testStart('${feature.featureName}');
    await page.goto('${feature.url}');
  });

  test.afterEach(async ({}, testInfo) => {
    const status = testInfo.status === 'passed' ? 'PASSED' : 'FAILED';
    Logger.testEnd('${feature.featureName}', status);
  });

  test('${feature.description}', async ({ page }) => {
${actionSteps}
  });
});
`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate a Playwright test scaffold from a plain-English feature description.
 *
 * @param feature - structured feature description
 * @returns GeneratedTest object with full TypeScript code
 *
 * @example
 * const result = generateTest({
 *   featureName: 'User Login',
 *   description: 'User can log in with valid credentials',
 *   url: 'https://demoqa.com/login',
 *   actions: ['fill username field', 'fill password field', 'click login button'],
 *   assertions: ['verify user is visible on dashboard', 'verify url contains /profile'],
 *   tags: ['smoke', 'auth'],
 * });
 */
export function generateTest(feature: FeatureDescription): GeneratedTest {
  Logger.info(`🤖 AI Test Generator → Processing: "${feature.featureName}"`);

  const actionSteps: GeneratedTestStep[] = feature.actions.map(parseAction);
  const assertionSteps: GeneratedTestStep[] = feature.assertions.map(parseAssertion);
  const allSteps = [...actionSteps, ...assertionSteps];

  const fullCode = buildTestCode(feature, allSteps);
  const fileName = `${feature.featureName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}.ai.spec.ts`;

  const result: GeneratedTest = {
    fileName,
    testTitle: feature.description,
    steps: allSteps,
    imports: ['@playwright/test', '../utils/logger'],
    fullCode,
    aiConfidenceScore: computeConfidenceScore(feature),
    generatedAt: new Date().toISOString(),
  };

  Logger.info(
    `✅ Generated ${allSteps.length} steps | Confidence: ${result.aiConfidenceScore}%`
  );

  return result;
}

/**
 * Save a generated test to disk.
 *
 * @param generatedTest - output from generateTest()
 * @param outputDir - directory to write into (default: tests/ai-generated)
 */
export function saveGeneratedTest(
  generatedTest: GeneratedTest,
  outputDir = path.resolve(__dirname, '../tests/ai-generated')
): string {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, generatedTest.fileName);
  fs.writeFileSync(filePath, generatedTest.fullCode, 'utf-8');
  Logger.info(`💾 Saved AI-generated test → ${filePath}`);
  return filePath;
}

/**
 * Batch-generate multiple tests from an array of feature descriptions.
 */
export function generateTestSuite(features: FeatureDescription[]): GeneratedTest[] {
  Logger.info(`🤖 Batch generating ${features.length} tests…`);
  return features.map(generateTest);
}
