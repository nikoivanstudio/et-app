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
  title: 'Прокат велосипедов в Крыму',
  description:
    'Велосипеды разных размеров с подбором под рост. Залог документами или 30 000 ₽ за велосипед, возвращается при сдаче без повреждений.',
  path: '/uslugi/prokat-velosipedov-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
