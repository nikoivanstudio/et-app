import { FC } from 'react';

import { partnerApplicationService } from '@/features/partner-application/server';

import { UserDomain } from '@/entities/user';

import { ProfileLayout } from '@/views/profile/ui/profile-view-layout';

type ProfileViewProps = {
  user: UserDomain.UserEntity;
};

export const ProfileView: FC<ProfileViewProps> = async ({ user }) => {
  // Статус заявки нужен только обычным пользователям — остальные уже партнёры/сотрудники.
  const application =
    user.role === UserDomain.Role.USER
      ? await partnerApplicationService.getLatestApplicationByUser(user.id)
      : null;

  return (
    <ProfileLayout
      id={user.id}
      role={user.role}
      applicationStatus={application?.status ?? null}
    />
  );
};
