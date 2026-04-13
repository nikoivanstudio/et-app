import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';


export const metadata: Metadata = {
  title: 'Прокат зимнего снаряжения в Крыму',
  description: 'Прокат зимнего снаряжения в Крыму'
};

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
