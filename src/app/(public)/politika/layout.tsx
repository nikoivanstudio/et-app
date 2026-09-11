import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Политика обработки персональных данных',
  description:
    'Как Energy Tour обрабатывает персональные данные: что собирают формы сайта, зачем это нужно, сколько данные хранятся и как их удалить.',
  path: '/politika'
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
