import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  TestStep
} from '@playwright/test/reporter';

/**
 * Минимальный репортёр для BDD: печатает ✓/✗ напротив КАЖДОГО шага Gherkin
 * (Дано / Когда / Тогда / И), а в конце — итог по сценариям.
 *
 * Включается в playwright.bdd.config.ts:
 *   reporter: [['./tests/bdd/gherkin-reporter.ts'], ['html', { open: 'never' }]]
 */

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const GRAY = '\x1b[90m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

class GherkinReporter implements Reporter {
  private passed = 0;
  private failed = 0;

  onTestBegin(test: TestCase) {
    // Заголовок сценария (последний сегмент пути теста)
    console.log(`\n  ${BOLD}Сценарий:${RESET} ${test.title}`);
  }

  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
    // Только верхнеуровневые Gherkin-шаги (они оборачиваются в test.step),
    // а не вложенные действия Playwright (pw:api / expect).
    if (step.category !== 'test.step' || step.parent) return;

    const ok = !step.error;
    const mark = ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`    ${mark} ${step.title} ${GRAY}(${step.duration}ms)${RESET}`);

    if (!ok && step.error?.message) {
      const firstLine = step.error.message.split('\n')[0];
      console.log(`        ${RED}↳ ${firstLine}${RESET}`);
    }
  }

  onTestEnd(_test: TestCase, result: TestResult) {
    result.status === 'passed' ? this.passed++ : this.failed++;
  }

  onEnd(result: FullResult) {
    const total = this.passed + this.failed;
    const color = this.failed ? RED : GREEN;
    console.log(
      `\n  ${color}${BOLD}Итог:${RESET} ${color}${this.passed} ✓${RESET}` +
        (this.failed ? `  ${RED}${this.failed} ✗${RESET}` : '') +
        ` ${GRAY}из ${total} сценариев — ${result.status}${RESET}\n`
    );
  }
}

export default GherkinReporter;
