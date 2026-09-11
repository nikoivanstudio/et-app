/**
 * Бюджет Core Web Vitals (задача D5).
 *
 * Зачем он вообще нужен отдельным файлом, а не строкой в отчёте: без
 * зафиксированных чисел «стало быстрее» — это ощущение, и спорить о нём
 * можно бесконечно. С числами вопрос закрывается замером.
 *
 * Значения — пороги «хорошо» по методике Core Web Vitals, без послаблений.
 * Смягчать их под текущее состояние сайта бессмысленно: ранжирование
 * смотрит на исходные пороги, а не на наши.
 *
 * Измеряется 75-й процентиль по реальным посетителям (в Метрике —
 * «Скорость загрузки»), а не среднее: среднее скрывает именно тот хвост,
 * из-за которого страница считается медленной.
 */
export type WebVitalName = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';

export type Budget = {
  /** Порог «хорошо»: 75-й процентиль должен быть не выше. */
  good: number;
  /** Выше этого — «плохо»; между ними «требует улучшения». */
  poor: number;
  unit: 'ms' | 'score';
  what: string;
};

export const WEB_VITALS_BUDGET: Record<WebVitalName, Budget> = {
  LCP: {
    good: 2500,
    poor: 4000,
    unit: 'ms',
    what: 'Отрисовка главного элемента — обычно фото в шапке страницы'
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
    unit: 'score',
    what: 'Сдвиг вёрстки при загрузке'
  },
  INP: {
    good: 200,
    poor: 500,
    unit: 'ms',
    what: 'Отклик на действие: нажатие кнопки, открытие формы'
  },
  FCP: {
    good: 1800,
    poor: 3000,
    unit: 'ms',
    what: 'Первая отрисовка чего-либо'
  },
  TTFB: {
    good: 800,
    poor: 1800,
    unit: 'ms',
    what: 'Время до первого байта'
  }
};

export type Verdict = 'good' | 'needs-improvement' | 'poor';

export const rateMetric = (name: WebVitalName, value: number): Verdict => {
  const budget = WEB_VITALS_BUDGET[name];

  if (value <= budget.good) return 'good';

  return value <= budget.poor ? 'needs-improvement' : 'poor';
};

/**
 * Страницы, на которых снимаются замеры.
 *
 * По одной на каждый ТИП страницы, а не наугад: у них разная вёрстка
 * и разные узкие места. У карточки тура и справочной страницы главный
 * элемент — фото в шапке (LCP), у каталога — сетка карточек (CLS),
 * у статьи справочника — картинки внутри текста (D2).
 */
export const MEASURED_PAGES = [
  { path: '/', name: 'Главная' },
  { path: '/tours', name: 'Каталог туров' },
  { path: '/dzhip-tur-krym', name: 'Посадочная джип-туров' },
  { path: '/dzhip-tury/bahchisaray', name: 'Гео-страница' },
  { path: '/posts', name: 'Список статей' },
  { path: '/chufut-kale', name: 'Статья справочника' },
  { path: '/uslugi/prokat-palatki-v-krymu', name: 'Страница услуги' },
  { path: '/kontakty', name: 'Контакты' }
] as const;
