/**
 * AI Test Generator — Demo Script
 *
 * Run this to see the AI generator in action and produce a real .spec.ts file:
 *   npx ts-node utils/runAiGenerator.ts
 */

import { generateTest, saveGeneratedTest, generateTestSuite } from './aiTestGenerator';

// ─── Example 1: Single test generation ───────────────────────────────────────

const loginFeature = generateTest({
  featureName: 'User Login Validation',
  description: 'User can log in with valid credentials and is redirected to profile',
  url: '/login',
  actions: [
    'fill username field "#userName"',
    'fill password field "#password"',
    'click login button "#login"',
  ],
  assertions: [
    'verify url contains "/profile"',
    'verify "userName-value" is visible',
  ],
  tags: ['smoke', 'auth', 'ai-generated'],
});

console.log('\n════════════════════════════════════════');
console.log('       AI GENERATED TEST SCAFFOLD');
console.log('════════════════════════════════════════\n');
console.log(`📝 File: ${loginFeature.fileName}`);
console.log(`🎯 Title: ${loginFeature.testTitle}`);
console.log(`🤖 AI Confidence: ${loginFeature.aiConfidenceScore}%`);
console.log(`⚙️  Steps: ${loginFeature.steps.length}`);
console.log(`📅 Generated: ${loginFeature.generatedAt}`);
console.log('\n─── Generated Code Preview ────────────\n');
console.log(loginFeature.fullCode);

// ─── Example 2: Batch generation ─────────────────────────────────────────────

const suite = generateTestSuite([
  {
    featureName: 'Shopping Cart',
    description: 'User can add item to cart and see updated count',
    url: '/shop',
    actions: ['click add-to-cart button ".add-btn"', 'hover cart icon "#cart"'],
    assertions: ['verify cart count "#cart-count" is visible', 'verify url contains "/cart"'],
    tags: ['regression', 'ai-generated'],
  },
  {
    featureName: 'Search Functionality',
    description: 'User can search for products and see results',
    url: '/search',
    actions: ['fill search input "#search-box"', 'press "Enter"'],
    assertions: ['verify results visible ".results-list"', 'verify count of ".result-item"'],
    tags: ['smoke', 'ai-generated'],
  },
]);

console.log('\n════════════════════════════════════════');
console.log(`    BATCH GENERATED: ${suite.length} TESTS`);
console.log('════════════════════════════════════════\n');
suite.forEach((t) => {
  console.log(`  ✅ ${t.fileName} — Confidence: ${t.aiConfidenceScore}%`);
});

// ─── Save the login test to disk ──────────────────────────────────────────────

const savedPath = saveGeneratedTest(loginFeature);
console.log(`\n💾 Saved to: ${savedPath}`);
console.log('\n✨ Tip: Review the generated file and refine selectors before running.\n');
