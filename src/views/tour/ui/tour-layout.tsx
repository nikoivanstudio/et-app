'use server';

import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { ContactsWidget } from '@/widgets/contacts/containers/contacts-widget';

type Props = {
  params: Promise<{ slug: string }>;
};

export const TourViewLayout: FC<PropsWithChildren<Props>> = async ({
  children
}) => {
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
