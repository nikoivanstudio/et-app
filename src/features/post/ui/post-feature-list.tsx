'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { usePostList } from '@/features/post/hooks/use-post-list';
import { PostCard } from '@/features/post/ui/post-card';

import { SessionDomain } from '@/entities/user/server';

const cnPostFeatureList = cn('PostFeatureList');

export const PostFeatureList: FC<{
  session: SessionDomain.SessionEntity;
}> = ({ session }) => {
  const { data, isFetching, tools, pagination, cursor } = usePostList();

  return (
    <>
      {tools}
      {!!data?.posts?.length && (
        <div
          className={cnPostFeatureList('Wrapper', [
            isFetching ? 'opacity-50' : ''
          ])}
        >
          {pagination}
          <ul className={cnPostFeatureList()}>
            {data.posts.map(post => (
              <li
                className={cnPostFeatureList('Item', [
                  'flex',
                  'justify-center',
                  'mt-3'
                ])}
                key={post.id}
              >
                <PostCard {...post} session={session} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {cursor}
    </>
  );
};
