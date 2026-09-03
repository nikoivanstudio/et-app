import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { defineBddConfig } from 'playwright-bdd';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * BDD-конфигурация (Gherkin + Playwright через playwright-bdd).
 * Из .feature-файлов и шагов генерируются обычные Playwright-тесты.
 * Запуск: `npm run test:bdd` (bddgen + playwright test).
 */
const testDir = defineBddConfig({
  features: 'tests/bdd/features/**/*.feature',
  steps: 'tests/bdd/steps/**/*.ts'
});

const baseURL = process.env.TEST_ENV_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* ✓/✗ по каждому шагу Gherkin в терминале; html — подробный отчёт */
  reporter: [
    ['./tests/bdd/gherkin-reporter.ts'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  /* Поднимаем dev-сервер автоматически перед прогоном E2E */
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
