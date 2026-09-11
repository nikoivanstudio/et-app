import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import {
  buildPageMetadata,
  withPaginationRobots
} from '@/shared/lib/seo/page-metadata';

/**
 * Вторая страница легаси-каталога.
 *
 * Заголовок и описание совпадали с первой страницей слово в слово — ровно
 * тот же дефект, что и у `/posts/N` (B4). В индексе ей делать нечего,
 * а обход карточек с неё продолжается: `noindex, follow`.
 */
export const metadata: Metadata = withPaginationRobots(
  buildPageMetadata({
    title: 'Все туры по Крыму — страница 2',
    description:
      'Продолжение каталога: джип-туры и индивидуальные экскурсии по Крыму с выездом из Бахчисарая и Севастополя.',
    path: '/category/vse_tury/page/2'
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
