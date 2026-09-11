import { expect, test } from '@playwright/test';

import {
  MEASURED_PAGES,
  rateMetric,
  WEB_VITALS_BUDGET
} from '../src/shared/config/performance-budget';

/**
 * Лабораторный замер Core Web Vitals (задача D5).
 *
 * Что он даёт и чего не даёт. Не даёт — оценки ранжирования: она строится
 * по 75-му процентилю живого трафика, и снимает её Метрика
 * (`shared/lib/analytics/web-vitals.tsx`). Даёт — воспроизводимые цифры
 * «до» и «после» на одинаковых условиях: без них нельзя сказать, что
 * снятие `images.unoptimized` (D1), обработка картинок в тексте (D2)
 * и возврат ISR (D3) действительно что-то изменили.
 *
 * Эмуляция 4G обязательна. На проводном канале LCP укладывается
 * в бюджет почти всегда — включая ту версию, где фото на карточке
 * весило 449 КБ при показе в 639 пикселей. Крымский трафик летом
 * это в основном телефоны на мобильной сети.
 *
 * Запуск:
 *   npx playwright test tests/web-vitals.spec.ts --project=chromium
 *   TEST_ENV_BASE_URL=https://energy-tur.ru npx playwright test tests/web-vitals.spec.ts
 */

/** Медленный 4G: те же значения, что в профиле DevTools. */
const SLOW_4G = {
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150
};

type Sample = {
  lcp: number;
  cls: number;
  fcp: number;
  ttfb: number;
};

test.describe('Core Web Vitals', () => {
  // Замер идёт по одной странице за раз: параллельные вкладки делят
  // канал, и цифры перестают что-либо значить.
  test.describe.configure({ mode: 'serial' });

  for (const page_ of MEASURED_PAGES) {
    test(`${page_.name} (${page_.path})`, async ({ page, browserName }) => {
      // Троттлинг доступен только в Chromium: в остальных браузерах
      // замер без эмуляции канала вводил бы в заблуждение.
      test.skip(
        browserName !== 'chromium',
        'Эмуляция сети есть только в Chromium'
      );

      const client = await page.context().newCDPSession(page);

      await client.send('Network.enable');
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        ...SLOW_4G
      });

      const response = await page.goto(page_.path, {
        waitUntil: 'networkidle'
      });

      expect(response?.status(), 'страница должна отвечать 200').toBe(200);

      const sample = await page.evaluate<Sample>(async () => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        const paint = performance
          .getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint');

        const lcpEntries = performance.getEntriesByType(
          'largest-contentful-paint'
        );

        // CLS собирается с начала загрузки: одно значение на момент
        // замера ничего не говорит, нужна сумма сдвигов.
        const cls = performance
          .getEntriesByType('layout-shift')
          .filter(
            entry =>
              !(entry as unknown as { hadRecentInput: boolean }).hadRecentInput
          )
          .reduce(
            (sum, entry) => sum + (entry as unknown as { value: number }).value,
            0
          );

        return {
          lcp: lcpEntries.length
            ? lcpEntries[lcpEntries.length - 1].startTime
            : 0,
          cls,
          fcp: paint?.startTime ?? 0,
          ttfb: navigation.responseStart - navigation.requestStart
        };
      });

      const report = {
        LCP: Math.round(sample.lcp),
        CLS: Number(sample.cls.toFixed(3)),
        FCP: Math.round(sample.fcp),
        TTFB: Math.round(sample.ttfb)
      } as const;

      // Печатаем всегда, а не только при провале: смысл замера —
      // в сравнении «до» и «после», и цифры нужны даже когда всё зелено.
      console.log(
        `${page_.path}  ` +
          Object.entries(report)
            .map(
              ([name, value]) =>
                `${name}=${value}${WEB_VITALS_BUDGET[name as keyof typeof report].unit === 'ms' ? 'ms' : ''} (${rateMetric(name as keyof typeof report, value)})`
            )
            .join('  ')
      );

      expect
        .soft(report.LCP, 'LCP: отрисовка главного элемента')
        .toBeLessThanOrEqual(WEB_VITALS_BUDGET.LCP.good);
      expect
        .soft(report.CLS, 'CLS: сдвиг вёрстки')
        .toBeLessThanOrEqual(WEB_VITALS_BUDGET.CLS.good);
      expect
        .soft(report.TTFB, 'TTFB: время до первого байта')
        .toBeLessThanOrEqual(WEB_VITALS_BUDGET.TTFB.good);
    });
  }
});
