import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import {
  buildPageMetadata,
  withDuplicateRobots
} from '@/shared/lib/seo/page-metadata';

/**
 * Дубль страницы услуги.
 *
 * Адрес рендерит то же содержимое, что `/uslugi/klassicheskie-ekskursii-po-krymu`
 * (см. `page.tsx`: тот же заголовок и тот же текст), то есть это две
 * страницы под один материал. Сильнее сегмент услуг — там материал лежит
 * по смыслу и оттуда на него ведут ссылки; 301 заведён
 * в `prisma/data/redirects.csv`.
 *
 * До заливки правил страница закрыта от индексации. Заодно исправлены
 * заголовок и описание: сюда были скопированы title и description
 * страницы проката велосипедов — вместе с сырым `<strong>` и переносами
 * строк внутри мета-тега (нашла проверка H1).
 */
export const metadata: Metadata = withDuplicateRobots(
  buildPageMetadata({
    title: 'Классические экскурсии по Крыму — цены',
    description:
      'Раздел объединён со страницей услуги «Классические экскурсии по Крыму»: маршруты, условия и цены — там.',
    path: '/dzhip-tur-krym/ekskursii-v-krymu-s-luchshimi-tsenami'
  })
);

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AppHeader variant='public' />
      {children}
      <footer className='mt-12'>
        <ContactsWidget />
      </footer>
    </>
  );
}
