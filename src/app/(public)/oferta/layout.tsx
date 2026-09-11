import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Публичная оферта Energy Tour — условия оказания услуг',
  description:
    'Условия, на которых Energy Tour принимает заявки на джип-туры и услуги проката: как заключается договор, из чего складывается стоимость, изменение и отмена поездки.',
  path: '/oferta'
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
