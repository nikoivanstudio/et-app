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
  title: 'Аренда внедорожника с водителем в Крыму',
  description:
    'Nissan Patrol, Mitsubishi Pajero и L200, УАЗ с водителем-инструктором. От 2 500 до 3 500 ₽ в час за машину, топливо и сборы включены.',
  path: '/uslugi/arenda-vnedorozhnika-s-voditelem-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
