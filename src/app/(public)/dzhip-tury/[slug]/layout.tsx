import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { findDzhipTuryLanding } from '@/entities/landing/server';

import {
  buildNoindexMetadata,
  buildPageMetadata
} from '@/shared/lib/seo/page-metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = findDzhipTuryLanding(slug);

  // Такой посадочной нет — страница отдаёт 404, а мета закрывает адрес
  // от индексации на случай, если статус успеет уйти со стримом.
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
