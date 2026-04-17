'use client';

import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import { SessionDomain } from '@/entities/user/server';

import { useUserList } from '../hooks/use-user-list';

import { UserFeature } from './user-feature';

const cnUserFeatureList = cn('UserFeatureList');

export const UserFeatureList: FC<{
  renderEditAction?: (props: {
    user: Omit<
      {
        id: number;
        login: string;
        passwordHash: string;
        salt: string;
        role: string;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        avatarPhotoId: number | null;
        email: string | null;
        rating: number | null;
      },
      'passwordHash' | 'salt'
    >;
  }) => ReactNode;
  session: SessionDomain.SessionEntity;
}> = ({ renderEditAction }) => {
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
                <UserFeature
                  user={user}
                  editAction={renderEditAction?.({ user })}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {cursor}
    </>
  );
};
