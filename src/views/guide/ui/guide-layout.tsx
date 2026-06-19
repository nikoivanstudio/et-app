'use server';

import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

export const GuideViewLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <>
      <AppHeader variant='public' />
      {children}
      <footer>
        <ContactsWidget />
      </footer>
    </>
  );
};
