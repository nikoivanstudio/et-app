import { FC } from 'react';

import { guideServices } from '@/kernel/guide/server';
import { GuidesView } from '@/views/guides/server';

export const revalidate = 86400;

const Page: FC = async () => {
  const guides = await guideServices.getGuideList();

  return <GuidesView guides={guides} />;
};

export default Page;
