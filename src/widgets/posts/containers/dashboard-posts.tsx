'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { MigrationPosts } from '@/widgets/posts/ui/posts-migration';

import { ExportPosts, PostFeatureList } from '@/features/post';
import { FeaturePost } from '@/features/post/ui/feature-post';

import { SessionDomain } from '@/entities/user/server';

import { Spinner } from '@/shared/ui/spinner';

import { Layout } from '../ui/layout';

const cnDashboardPosts = cn('DashboardPosts');

export const DashboardPosts: FC<{ session: SessionDomain.SessionEntity }> = ({
  session
}) => {
  const isLoading = false;

  return (
    <>
      {isLoading && (
        <div className='flex justify-center items-center w-full h-full min-h-96'>
          <Spinner />
        </div>
      )}
      <Layout
        className={cnDashboardPosts()}
        title={null}
        list={<PostFeatureList session={session} />}
        actions={
          <div>
            <FeaturePost session={session} type='create' />
            <MigrationPosts />
            <ExportPosts />
          </div>
        }
      />
    </>
  );
};
