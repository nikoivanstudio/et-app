import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { findRouteLanding } from '@/entities/landing/server';

import {
  buildNoindexMetadata,
  buildPageMetadata
} from '@/shared/lib/seo/page-metadata';

const FROM_SEGMENT = 'iz-bahchisaraya';

export async function generateMetadata({
  params
}: {
  params: Promise<{ to: string }>;
}): Promise<Metadata> {
  const { to } = await params;
  const landing = findRouteLanding(FROM_SEGMENT, to);

  if (!landing) {
    return buildNoindexMetadata('Страница не найдена');
  }

  return buildPageMetadata({
    title: landing.metaTitle,
    description: landing.metaDescription,
    path: landing.path
  });
}

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <AppHeader variant='public' />
    {children}
    <footer className='mt-12'>
      <ContactsWidget />
    </footer>
  </>
);

export default Layout;
