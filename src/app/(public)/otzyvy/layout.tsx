import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

export const metadata: Metadata = {
  title: 'Отзывы — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены',
  description:
    'Отзывы — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены'
};

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
