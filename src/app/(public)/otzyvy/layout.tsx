import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

/**
 * Отзывы.
 *
 * Заголовок и описание совпадали слово в слово, а сам заголовок был
 * склеен из названия раздела и общего хвоста сайта — «Отзывы — Джип туры
 * и индивидуальные экскурсии по Крыму. Лучшие цены» (нашла проверка H1).
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Отзывы о джип-турах Energy Tour',
  description:
    'Что пишут о поездках с Energy Tour: маршруты, гиды и техника глазами тех, кто уже съездил.',
  path: '/otzyvy'
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
