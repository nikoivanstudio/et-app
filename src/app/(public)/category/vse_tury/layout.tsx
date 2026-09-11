import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Легаси-каталог WordPress.
 *
 * Заголовок и описание совпадали слово в слово — такое описание
 * поисковик отбрасывает и собирает сниппет сам (нашла проверка H1).
 *
 * Страница остаётся индексируемой, пока это ЕДИНСТВЕННЫЙ каталог
 * с карточками: в базе нет ни одного опубликованного тура (A1).
 * Её 301 на `/tours` лежит в `prisma/data/redirects.csv` и включается
 * вместе с наполнением каталога (A4).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Все туры по Крыму — джип-туры и экскурсии',
  description:
    'Каталог маршрутов Energy Tour: джип-туры к пещерным городам, каньонам и плато, классические экскурсии. Цена за машину, выезд из Бахчисарая и Севастополя.',
  path: '/category/vse_tury'
});

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
