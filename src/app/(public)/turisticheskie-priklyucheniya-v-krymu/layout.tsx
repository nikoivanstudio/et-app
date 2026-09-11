import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import {
  buildPageMetadata,
  withDuplicateRobots
} from '@/shared/lib/seo/page-metadata';

/**
 * Текст без предложения: страница пересказывает каталог другими словами
 * и ни на что не ведёт. Склеивается с `/tours` (B7), до заливки правил —
 * закрыта от индексации, чтобы не конкурировать с каталогом.
 *
 * Описание было слепком первых 1200 символов текста, вместе с опечаткой
 * «воз-можность» из переноса WordPress.
 */
export const metadata: Metadata = withDuplicateRobots(
  buildPageMetadata({
    title: 'Туристические приключения в Крыму',
    description:
      'Активный отдых в Крыму: джип-туры, пещерные города, каньоны и горные плато. Маршруты и цены — в каталоге туров.',
    path: '/turisticheskie-priklyucheniya-v-krymu'
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
