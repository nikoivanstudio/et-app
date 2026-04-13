'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { SessionDomain } from '@/entities/user/server';

import { useUserList } from '../hooks/use-user-list';

import { UserFeature } from './user-feature';

const cnUserFeatureList = cn('UserFeatureList');

export const UserFeatureList: FC<{
  session: SessionDomain.SessionEntity;
}> = () => {
  const { data, isFetching, pagination, tools, cursor } = useUserList();

  return (
    <>
      {tools}
      {!!data?.users?.length && (
        <div
          className={cnUserFeatureList('Wrapper', [
            isFetching ? 'opacity-50' : ''
          ])}
        >
          {pagination}
          <ul className={cnUserFeatureList()}>
            {data.users.map(user => (
              <li
                className={cnUserFeatureList('Item', [
                  'flex',
                  'justify-center',
                  'mt-3'
                ])}
                key={user.id}
              >
                <UserFeature user={user} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {cursor}
    </>
  );
};
