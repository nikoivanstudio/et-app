'use server';

import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { postServices } from '@/features/post/services/post-services';

import { getMetadataByEither } from '@/shared/lib/metadata-utils';
import { ServerPostProps } from '@/shared/model/types';

import { PostViewLayout } from '@/views/post/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const either = await postServices.getPostMetaDataBySlug(slug);

  return await getMetadataByEither(either, `/${slug}`);
}

const Layout: FC<PropsWithChildren<ServerPostProps>> = async ({
  children,
  ...props
}) => <PostViewLayout {...props}>{children}</PostViewLayout>;

export default Layout;
