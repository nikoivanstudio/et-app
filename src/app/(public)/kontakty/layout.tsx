import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

export const metadata: Metadata = {
  title:
    'Контакты — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены',
  description:
    'Контакты — Джип туры и индивидуальные экскурсии по Крыму в г. Бахчисарай'
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
