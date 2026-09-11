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
  title: 'Прокат квадроциклов в Крыму',
  description:
    'Двухместные квадроциклы 500 куб. см с независимой подвеской: 1 500 ₽ в час, сопровождение инструктора включено, от четырёх машин — скидка.',
  path: '/uslugi/prokat-kvadrotsiklov-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
