'use server';

import { FC } from 'react';

import { Contacts } from '@/widgets/app-header/ui/contacts';
import { DesktopNav } from '@/widgets/app-header/ui/desktop-nav';
import { Layout } from '@/widgets/app-header/ui/layout';
import { Logo } from '@/widgets/app-header/ui/logo';
import { MainNav } from '@/widgets/app-header/ui/main-nav';
import { Profile } from '@/widgets/app-header/ui/profile';

import { ToggleTheme } from '@/features/theme/toogle-theme';

import { sessionService } from '@/entities/user/server';

type AppHeaderProps = {
  variant: 'auth' | 'private' | 'public';
};

export const AppHeader: FC<AppHeaderProps> = async ({ variant }) => {
  const isProfile = variant !== 'auth';
  const session = sessionService.verifySession();

  return (
    <Layout
      nav={<MainNav />}
      desktopNav={<DesktopNav />}
      logo={<Logo />}
      profile={isProfile && !!session && <Profile />}
      actions={<ToggleTheme />}
      rightNode={<Contacts />}
    />
  );
};
