import { redirect } from 'next/navigation';
import React, { FC, ReactNode } from 'react';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/services/session';

const DashboardView: FC<{ children: ReactNode }> = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { session } = await sessionService.verifySessionWithRedirect();

  const hasPermissions = roleUtils.userHasPermissionOn(
    session?.role,
    'dashboard'
  );

  if (!hasPermissions) {
    redirect('/');
  }

  return <>{children}</>;
};

export default DashboardView;
