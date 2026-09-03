import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Групповые туры в Крыму',
  description:
    'Недорогие групповые туры по Крыму в 2026 году с индивидуальным подходом',
  path: '/activities'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
