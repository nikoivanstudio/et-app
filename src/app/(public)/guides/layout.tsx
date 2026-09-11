import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Гиды Energy Tour — кто водит джип-туры по Крыму',
  description:
    'Водители-инструкторы Energy Tour: стаж, техника, маршруты и отзывы по каждому гиду. Выбирайте, с кем поедете.',
  path: '/guides'
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
