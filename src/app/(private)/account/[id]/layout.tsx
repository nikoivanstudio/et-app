import React, { FC, ReactNode } from 'react';

import { AccountHeader } from '@/widgets/app-header/server';

const AccountLayout: FC<{ children: ReactNode }> = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <>
    <AccountHeader />
    {children}
  </>
);

export default AccountLayout;
