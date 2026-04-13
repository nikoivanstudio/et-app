'use server';

import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { LogoIcon } from '@/shared/ui/logo-icon';

const cnLogo = cn('Logo');

export const Logo: FC = async () => (
  <Link className={cnLogo()} href='/'>
    <LogoIcon />
  </Link>
);
