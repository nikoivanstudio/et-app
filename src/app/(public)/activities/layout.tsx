import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Групповые туры в Крыму',
    description: `Недорогие групповые туры по Крыму в ${getCurrentYear()} году с индивидуальным подходом`,
    path: '/activities'
  });
}

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
