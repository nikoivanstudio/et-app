import { cn } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

import { DashboardHeader } from '@/widgets/app-header/server';

import { PropsWithClassNames } from '@/shared/model/types';

const cnDashboardView = cn('DashboardView');

export const DashboardLayout: FC<
  PropsWithChildren<PropsWithClassNames & { type?: string }>
> = async ({ children, className, type }) => (
  <>
    <DashboardHeader />
    <main className={cnDashboardView({ type }, ['pt-20', className])}>
      {children}
    </main>
  </>
);
