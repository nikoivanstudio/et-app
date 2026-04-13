'use server';

import { Search } from 'lucide-react';
import { FC } from 'react';

import { Layout } from '@/widgets/app-header/ui/layout';
import { Logo } from '@/widgets/app-header/ui/logo';
import { MainNav } from '@/widgets/app-header/ui/main-nav';

export const AccountHeader: FC = async () => {
  return <Layout nav={<MainNav />} logo={<Logo />} rightNode={<Search />} />;
};
