'use client';

import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import { useDeleteUser } from '@/features/user/hooks/use-delete-user';
import { UserCard } from '@/features/user/ui/user-card';

const cnUserFeature = cn('UserFeature');

export const UserFeature: FC<{
  editAction?: ReactNode;
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
}> = ({ user, editAction }) => {
  const onDelete = useDeleteUser({ id: user.id });

  return (
    <div className={cnUserFeature(null, ['w-full'])}>
      <UserCard user={user} onDelete={onDelete} editAction={editAction} />
    </div>
  );
};
