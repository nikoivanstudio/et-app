import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'О компании Energy Tour — джип-туры по Крыму',
  description:
    'Energy Tour: джип-туры и индивидуальные экскурсии по Крыму с выездом из Бахчисарая, Севастополя, Симферополя и Ялты. Подготовленные внедорожники, водители-инструкторы, цена за машину.',
  path: '/o-nas'
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
