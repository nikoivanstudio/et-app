import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/shared/lib/seo/page-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Прокат зимнего снаряжения в Крыму',
  description: 'Прокат зимнего снаряжения в Крыму',
  path: '/uslugi/prokat-zimnego-snaryazheniya-v-krymu'
});

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
