'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { FC } from 'react';

import {
  rateMetric,
  WEB_VITALS_BUDGET,
  type WebVitalName
} from '@/shared/config/performance-budget';

/**
 * Замер Core Web Vitals по реальным посетителям (задача D5).
 *
 * Почему по реальным, а не лабораторный прогон: лабораторный замер
 * показывает одно устройство и один канал, а ранжирование смотрит на
 * 75-й процентиль живого трафика. Крымский трафик летом — это в основном
 * телефоны на мобильной сети, и разница с замером на ноутбуке
 * с проводным интернетом двукратная.
 *
 * Значения уходят в Метрику параметрами визита: своего хранилища под
 * метрики заводить незачем, счётчик уже стоит, а разрез по страницам
 * и устройствам в нём и так есть.
 *
 * Компонент клиентский — этого требует `useReportWebVitals`, — поэтому
 * он вынесен отдельно и не тянет клиентскую границу на весь layout
 * (docs: 01-app/03-api-reference/04-functions/use-report-web-vitals.md).
 */

const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

const TRACKED: WebVitalName[] = ['LCP', 'CLS', 'INP', 'FCP', 'TTFB'];

const isTracked = (name: string): name is WebVitalName =>
  TRACKED.includes(name as WebVitalName);

type MetricPayload = {
  name: string;
  value: number;
};

const report = ({ name, value }: MetricPayload) => {
  if (!isTracked(name)) {
    return;
  }

  const budget = WEB_VITALS_BUDGET[name];
  // CLS приходит долей и в миллисекундах не измеряется; остальное
  // округляем до целых — доли миллисекунды в отчёте не нужны.
  const rounded =
    budget.unit === 'score' ? Number(value.toFixed(3)) : Math.round(value);
  const verdict = rateMetric(name, rounded);

  if (process.env.NODE_ENV === 'development') {
    // В разработке значения заведомо хуже боевых (нет минификации
    // и кеша), но порядок величин и регрессии видно.
    console.info(`[web-vitals] ${name}: ${rounded} — ${verdict}`);

    return;
  }

  if (!YM_ID || !('ym' in window)) {
    return;
  }

  // @ts-expect-error — глобал счётчика объявляется его же скриптом
  window.ym(Number(YM_ID), 'params', {
    webVitals: {
      [name]: rounded,
      [`${name}_verdict`]: verdict
    }
  });
};

export const WebVitals: FC = () => {
  useReportWebVitals(report);

  return null;
};
