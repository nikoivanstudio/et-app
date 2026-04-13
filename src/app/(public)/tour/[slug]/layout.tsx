import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { getMetadataByEither } from '@/shared/lib/metadata-utils';
import { ServerTourProps } from '@/shared/model/types';

import { tourServices } from '@/kernel/tour/server';
import { TourViewLayout } from '@/views/tour/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const either = await tourServices.getTourMetaData(slug);

  return await getMetadataByEither(either);
}

const Layout: FC<PropsWithChildren<ServerTourProps>> = async ({
  children,
  ...props
}) => <TourViewLayout {...props}>{children}</TourViewLayout>;

export default Layout;
