import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Метаданные страницы услуги.
 *
 * Были собраны автоматически из текста страницы: описания по 600–800
 * символов (поисковик показывает 160), с сырым `<strong>` и переносами
 * строк внутри мета-тега, а у «Классических экскурсий» и заголовок,
 * и описание приехали от страницы велосипедов — то есть две страницы
 * сайта представлялись поиску одной и той же (H1).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Прокат снегохода в Крыму',
  description:
    'Снегоходы Yamaha V-Max 500 и 700, Arctic Cat Crosstour: катание с инструктором, поездка по маршруту или выезд на целый день.',
  path: '/uslugi/prokat-snegohoda-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
