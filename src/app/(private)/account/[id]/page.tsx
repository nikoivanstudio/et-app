'use server';

import { redirect } from 'next/navigation';
import { FC } from 'react';

import { getCurrentUser } from '@/entities/user/services/get-current-user';

import { ProfileView } from '@/views/profile';

const Page: FC = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{!!user && <ProfileView user={user} />}</>;
};

export default Page;
