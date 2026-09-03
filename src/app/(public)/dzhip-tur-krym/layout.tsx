import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Экскурсии в Крыму с лучшими ценами',
  description: 'Экскурсии в Крыму с лучшими ценами',
  path: '/dzhip-tur-krym'
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
