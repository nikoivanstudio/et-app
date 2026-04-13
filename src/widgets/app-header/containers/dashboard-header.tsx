
import type { FC } from 'react';

import { Layout } from '@/widgets/app-header/ui/layout';
import { Logo } from '@/widgets/app-header/ui/logo';
import { MainNav } from '@/widgets/app-header/ui/main-nav';
import { Profile } from '@/widgets/app-header/ui/profile';

import { ToggleTheme } from '@/features/theme/toogle-theme';

type AppHeaderProps = {
  variant?: 'auth' | 'private' | 'public';
};

export const DashboardHeader: FC<AppHeaderProps> = async ({ variant }) => {
  const isProfile = variant !== 'auth';

  return (
    <Layout
      nav={<MainNav />}
      logo={<Logo />}
      profile={isProfile && <Profile />}
      actions={<ToggleTheme />}
    />
  );
};
