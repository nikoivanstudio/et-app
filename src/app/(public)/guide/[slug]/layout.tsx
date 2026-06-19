import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { getMetadataByEither } from '@/shared/lib/metadata-utils';

import { guideServices } from '@/kernel/guide/server';
import { GuideViewLayout } from '@/views/guide/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const either = await guideServices.getGuideMetaData(slug);

  return await getMetadataByEither(either);
}

const Layout: FC<PropsWithChildren> = async ({ children }) => (
  <GuideViewLayout>{children}</GuideViewLayout>
);

export default Layout;
