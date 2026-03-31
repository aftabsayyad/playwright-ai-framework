# 🤖 Playwright AI Test Automation Framework

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-1.44+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-Report-orange?style=for-the-badge)
![CI](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A production-grade, AI-assisted end-to-end test automation framework built with Playwright + TypeScript.**

[Features](#-features) · [Quick Start](#-quick-start) · [Folder Structure](#-folder-structure) · [AI Integration](#-ai-integration) · [Reporting](#-reporting) · [CI/CD](#-cicd)

</div>

---

## 📌 Project Overview

This framework demonstrates a **senior-level QA automation architecture** that blends traditional best practices (Page Object Model, fixtures, typed data) with an **AI-assisted test generation** layer — showcasing the future of intelligent test automation.

**Target site:** [DemoQA](https://demoqa.com) — a purpose-built practice site covering forms, elements, widgets, and a REST API.

### Why This Project Stands Out

| Capability | Implementation |
|---|---|
| 🤖 AI Test Generation | `aiTestGenerator.ts` converts plain-English feature descriptions into typed Playwright tests |
| 🏗️ POM Architecture | Every page encapsulates its locators and interactions in a strongly typed class |
| 🌐 Cross-browser | Chromium · Firefox · WebKit · Mobile Chrome — all in one config |
| ⚡ Parallel Execution | Sharded test runs across multiple workers |
| 📊 Rich Reporting | Allure HTML reports with screenshots, videos, and step-level detail |
| 🔄 CI/CD Ready | GitHub Actions with smoke → regression pipeline and artifact upload |
| 🌍 Multi-environment | `.env.dev` / `.env.stage` with runtime switching |
| 📝 Full Type Safety | Strict TypeScript throughout — no `any`, no shortcuts |

---

## ✨ Features

- ✅ **Page Object Model (POM)** — clean separation of test logic and UI interactions
- ✅ **AI Test Generator** — scaffold Playwright tests from plain-English descriptions
- ✅ **Cross-browser testing** — Chromium, Firefox, WebKit, Mobile Chrome
- ✅ **Parallel test execution** — configurable workers, sharded CI runs
- ✅ **Environment configs** — dev / stage with `.env` files
- ✅ **Screenshots on failure** — auto-attached to Allure reports
- ✅ **Video on failure** — retained for failed test debugging
- ✅ **Trace on failure** — full Playwright trace viewer support
- ✅ **Allure reporting** — suite / story / severity tagging
- ✅ **API testing** — built-in Playwright request context
- ✅ **Custom fixtures** — pre-wired page objects in every test
- ✅ **Winston logging** — file + console, with test lifecycle markers
- ✅ **Tag-based filtering** — `@smoke`, `@regression`, `@api`, `@ai-generated`
- ✅ **GitHub Actions** — multi-stage pipeline with report artifact upload

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- Java 17+ (for Allure CLI report generation)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/playwright-ai-framework.git
cd playwright-ai-framework
npm ci
```

### 2. Install Playwright Browsers

```bash
npm run playwright:install
# or install a specific browser
npx playwright install chromium
```

### 3. Run Tests

```bash
# All tests (default: dev environment)
npm test

# Smoke tests only
npm run test:smoke

# Specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# API tests only
npm run test:api

# Target environment
npm run test:dev
npm run test:stage

# Headed mode (see the browser)
npm run test:headed

# Debug mode
npm run test:debug
```

### 4. Generate & View Reports

```bash
# Generate Allure report from results
npm run report:generate

# Open the report in browser
npm run report:open

# Serve live (auto-open)
npm run report:serve
```

### 5. Run the AI Generator Demo

```bash
npx ts-node utils/runAiGenerator.ts
```

This will generate a scaffold `.spec.ts` file in `tests/ai-generated/` from a plain-English description.

---

## 📁 Folder Structure

```
playwright-ai-framework/
│
├── 📂 .github/
│   └── workflows/
│       └── playwright-ci.yml      # Full CI/CD pipeline
│
├── 📂 config/
│   ├── .env.dev                   # Dev environment variables
│   └── .env.stage                 # Stage environment variables
│
├── 📂 data/
│   └── testData.ts                # Typed test data & constants
│
├── 📂 fixtures/
│   └── test.fixtures.ts           # Extended test with page object injection
│
├── 📂 pages/                      # Page Object Model classes
│   ├── BasePage.ts                # Abstract base with shared helpers
│   ├── LoginPage.ts               # DemoQA login page
│   ├── FormsPage.ts               # Practice form page
│   └── ElementsPage.ts            # Text box / radio / web tables
│
├── 📂 tests/
│   ├── global.setup.ts            # Global setup (runs before all projects)
│   ├── login.spec.ts              # Login test suite
│   ├── form-submission.spec.ts    # Form tests
│   ├── elements.spec.ts           # Element interaction tests
│   ├── 📂 api/
│   │   └── bookstore-api.spec.ts  # REST API tests
│   └── 📂 ai-generated/
│       └── *.ai.spec.ts           # AI-scaffolded tests (human-refined)
│
├── 📂 utils/
│   ├── aiTestGenerator.ts         # 🤖 AI-powered test scaffold generator
│   ├── runAiGenerator.ts          # Demo runner for the AI generator
│   ├── helpers.ts                 # Reusable utility functions
│   └── logger.ts                  # Winston-based structured logger
│
├── 📂 reports/                    # (gitignored) Generated reports land here
├── playwright.config.ts           # Full Playwright configuration
├── tsconfig.json                  # TypeScript config with path aliases
├── package.json                   # Scripts & dependencies
└── README.md                      # You are here 👋
```

---

## 🤖 AI Integration

### How `aiTestGenerator.ts` Works

The AI generator simulates an **LLM-assisted test authoring workflow**:

```
Feature Description (plain English)
         ↓
   Intent Parser (NLP-lite)
         ↓
 Action + Assertion Mapping
         ↓
  Typed Playwright Scaffold
         ↓
  .spec.ts file on disk
```

**Usage:**

```typescript
import { generateTest, saveGeneratedTest } from './utils/aiTestGenerator';

const result = generateTest({
  featureName: 'User Login',
  description: 'User logs in with valid credentials',
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
  tags: ['smoke', 'auth'],
});

console.log(result.aiConfidenceScore); // 0–100
saveGeneratedTest(result); // writes to tests/ai-generated/
```

**Generated output:**
```typescript
// user-login.ai.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Login @smoke @auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('User logs in with valid credentials', async ({ page }) => {
    await page.locator('#userName').fill('test_value');
    await page.locator('#password').fill('test_value');
    await page.locator('#login').click();
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('[data-testid="userName-value"]')).toBeVisible();
  });
});
```

> 🔌 **To connect a real AI:** Replace the mock parser in `aiTestGenerator.ts` with a call to the OpenAI or Anthropic API. The interface stays the same.

---

## 🧪 Test Coverage

| Suite | Tests | Tags |
|---|---|---|
| Login | 6 | `@smoke` `@regression` `@auth` |
| Form Submission | 7 | `@regression` `@forms` |
| Elements | 7 | `@regression` `@elements` |
| BookStore API | 7 | `@api` `@smoke` |
| AI-Generated | 3 | `@smoke` `@ai-generated` |
| **Total** | **30** | |

---

## 📊 Reporting

### Allure Report

The framework uses [Allure](https://allurereport.org/) for rich, interactive HTML reports:

- 📂 Suites, stories, and severities
- 📸 Screenshots automatically attached on failure
- 🎬 Videos retained on failure
- 🔍 Full Playwright traces on failure
- 📈 Pass/fail trends over time

```bash
# Generate from latest results
npm run report:generate

# View in browser
npm run report:open
```

### Playwright Built-in Report

```bash
npx playwright show-report playwright-html-report
```

---

## 🔄 CI/CD

### Pipeline Overview

```
Push / PR
    │
    ├── 🔍 Quality Check (Lint + TypeScript)
    │
    ├── 🚀 Smoke Tests [Chromium | Firefox] ← parallel
    │        │
    │        └── 🧪 Regression Tests [4 shards] ← parallel
    │
    ├── 🌐 API Tests (independent)
    │
    └── 📊 Allure Report Generation + Artifact Upload
```

### Triggers

| Event | Action |
|---|---|
| Push to `main` / `develop` | Full pipeline |
| Pull Request | Full pipeline |
| Nightly schedule (02:00 UTC) | Full pipeline |
| Manual dispatch | Choose environment + browser |

### Artifacts Published

- `allure-html-report` — 30 day retention
- `playwright-html-report` — 14 day retention
- `smoke-results-*` / `regression-results-*` — 7 day retention

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ENV` | `dev` | Target environment |
| `BASE_URL` | `https://demoqa.com` | Application under test |
| `TEST_USERNAME` | `testUser` | Login test username |
| `TEST_PASSWORD` | `Test@1234` | Login test password |
| `LOG_LEVEL` | `info` | Winston log level |

### Run with custom env:

```bash
ENV=stage BASE_URL=https://stage.myapp.com npm test
```

---

## 🏷️ Tag Reference

```bash
# Run by tag
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @api
npx playwright test --grep "@smoke|@api"

# Exclude tag
npx playwright test --grep-invert @ai-generated
```

---

## 📸 Screenshots

> _Add screenshots of your Allure report, test results, and AI generator output here._

| Allure Dashboard | Test Details | AI Generator |
|---|---|---|
| `[screenshot]` | `[screenshot]` | `[screenshot]` |

---

## 🛠️ Tech Stack

| Tool | Purpose | Version |
|---|---|---|
| [Playwright](https://playwright.dev) | Browser automation & API testing | ^1.44 |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test code | ^5.4 |
| [Node.js](https://nodejs.org/) | Runtime | ≥ 20 |
| [Allure](https://allurereport.org/) | Test reporting | ^3.0 |
| [Winston](https://github.com/winstonjs/winston) | Structured logging | ^3.13 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD | — |

---

## 💡 Key Design Decisions

**Why Page Object Model?**
POM keeps test logic clean and UI-agnostic. When selectors change, you update one place — not 30 tests.

**Why custom fixtures?**
Playwright fixtures eliminate boilerplate. Page objects are injected typed and ready — no `new LoginPage(page)` in every test.

**Why Allure over built-in HTML report?**
Allure provides suite/story hierarchies, severity labels, step-level breakdowns, and trend charts — critical for stakeholder reporting.

**Why AI generator as a utility (not a test runner plugin)?**
Keeping it as a plain TypeScript module means it's portable, testable, and easy to swap the mock engine for a real LLM without touching test code.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2024 — Built with ❤️ by a passionate SDET

---

<div align="center">
  <strong>⭐ Star this repo if it helped you — it means a lot!</strong>
</div>
