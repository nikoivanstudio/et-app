'use server';

import { FC, PropsWithChildren } from 'react';

import { FilesLibraryDashboard } from '@/widgets/files-library/containers/files-library-dashboard';
import { DashboardPosts } from '@/widgets/posts';
import { DashboardTours } from '@/widgets/tours';
import { DashboardUsers } from '@/widgets/users';

import { SessionDomain } from '@/entities/user/server';

import { cn } from '@/shared/lib/css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { DashboardLayout } from '@/views/dashboard/ui/dashboard-layout';

export const DashboardSuperAdmin: FC<
  PropsWithChildren<{ session: SessionDomain.SessionEntity }>
> = async ({ session, children }) => (
  <DashboardLayout className={cn('p-4')} type='superAdmin'>
    <h1 className={cn('text-center')}>
      Панель управления cупер администратора
    </h1>
    <Tabs className={cn('my-3')} defaultValue='tours' orientation='vertical'>
      <TabsList
        className={cn(
          'h-full',
          'w-full',
          'flex-col',
          'items-start',
          'mx-auto',
          'bg-white',
          'dark:bg-black'
        )}
      >
        <TabsTrigger value='tours'>Туры компании</TabsTrigger>
        <TabsTrigger value='posts'>Посты/Легаси туры</TabsTrigger>
        <TabsTrigger value='users'>Пользователи</TabsTrigger>
        <TabsTrigger value='files'>Библиотека файлов</TabsTrigger>
      </TabsList>
      <TabsContent value='tours'>
        <DashboardTours session={session} />
      </TabsContent>
      <TabsContent value='posts'>
        <DashboardPosts session={session} />
      </TabsContent>
      <TabsContent value='users'>
        <DashboardUsers session={session} />
      </TabsContent>
      <TabsContent value='files'>
        <FilesLibraryDashboard session={session} />
      </TabsContent>
    </Tabs>
    {children}
  </DashboardLayout>
);
