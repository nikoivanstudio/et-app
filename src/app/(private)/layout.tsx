import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import { sessionService } from '@/entities/user/services/session';

import { cn } from '@/shared/lib/css';
import { buildNoindexMetadata } from '@/shared/lib/seo/page-metadata';
import { Button } from '@/shared/ui/button';

// Приватный раздел: кабинет, дашборд, заявка партнёра.
export const metadata: Metadata = buildNoindexMetadata('Личный кабинет');

import { routes } from '@/kernel/routes';

const PrivateLayout: FC<PropsWithChildren> = async ({ children }) => {
  const { session } = await sessionService.verifySessionWithRedirect();

  return (
    <div className={cn('bg-gray-900 w-full min-h-screen')}>
      <div className='hidden'>{session?.login}</div>
      <form
        className='hidden'
        action={async () => {
          'use server';
          await sessionService.deleteSession();
          redirect(routes.signIn());
        }}
      >
        <Button type='submit' variant='outline'>
          Выйти
        </Button>
      </form>
      {children}
    </div>
  );
};

export default PrivateLayout;
