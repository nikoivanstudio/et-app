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
  title: 'Прокат палатки и снаряжения в Крыму',
  description:
    'Палатки на 2–6 мест, спальные мешки и каримат напрокат. Залог документами или деньгами, при отсутствии повреждений возвращается полностью.',
  path: '/uslugi/prokat-palatki-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
