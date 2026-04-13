'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { useDeleteUser } from '@/features/user/hooks/use-delete-user';
import { UserCard } from '@/features/user/ui/user-card';

const cnUserFeature = cn('UserFeature');

export const UserFeature: FC<{
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
}> = ({ user }) => {
  const onDelete = useDeleteUser({ id: user.id });

  return (
    <div className={cnUserFeature(null, ['w-full'])}>
      <UserCard user={user} onDelete={onDelete} />
    </div>
  );
};
