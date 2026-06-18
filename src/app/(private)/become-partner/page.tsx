'use server';

import { redirect } from 'next/navigation';
import { FC } from 'react';

import { AccountHeader } from '@/widgets/app-header/server';

import { Role } from '@/entities/user/domain';
import { getCurrentUser } from '@/entities/user/services/get-current-user';

import { BecomePartnerLayout } from '@/views/become-partner';

const Page: FC = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Заявку могут подавать только обычные пользователи.
  if (user.role !== Role.USER) {
    redirect(`/account/${user.id}`);
  }

  return (
    <>
      <AccountHeader />
      <BecomePartnerLayout />
    </>
  );
};

export default Page;
