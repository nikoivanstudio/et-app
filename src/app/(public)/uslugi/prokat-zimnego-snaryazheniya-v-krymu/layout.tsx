import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

export const metadata: Metadata = {
  title: 'Прокат зимнего снаряжения в Крыму',
  description: 'Прокат зимнего снаряжения в Крыму'
};

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
