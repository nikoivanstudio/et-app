'use server';

import { FC } from 'react';

import { sessionService } from '@/entities/user/server';

import { DashboardGuide, DashboardSuperAdmin } from '@/views/dashboard/server';

const Page: FC = async () => {
  const { session } = await sessionService.verifySession();

  return (
    <>
      {!!session && (
        <>
          {session.role === 'GUIDE' && <DashboardGuide session={session} />}
          {session.role === 'SUPER_ADMIN' && (
            <DashboardSuperAdmin session={session} />
          )}
        </>
      )}
    </>
  );
};

export default Page;
