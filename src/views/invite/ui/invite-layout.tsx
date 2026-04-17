'use client';

import { cn } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

type Props = {
  referedLink: string;
};

const cnInviteLayout = cn('InviteLayout');

export const InviteLayout: FC<PropsWithChildren<Props>> = ({ children }) => (
  <div className={cnInviteLayout()}>{children}</div>
);
