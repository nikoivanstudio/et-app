import { FC } from 'react';

import { UserDomain } from '@/entities/user';

import { ProfileLayout } from '@/views/profile/ui/profile-view-layout';

type ProfileViewProps = {
  user: UserDomain.UserEntity;
};

export const ProfileView: FC<ProfileViewProps> = ({ user }) => {
  return <ProfileLayout id={user.id} role={user.role} />;
};
