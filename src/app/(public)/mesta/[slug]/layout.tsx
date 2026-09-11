import type { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { AppHeader } from '@/widgets/app-header/server';
import { ContactsWidget } from '@/widgets/contacts/server';

import { getMetadataByEither } from '@/shared/lib/metadata-utils';

import { placeServices } from '@/kernel/place/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return getMetadataByEither(
    await placeServices.getPlaceMetaData(slug),
    `/mesta/${slug}`
  );
}

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <AppHeader variant='public' />
    {children}
    <footer>
      <ContactsWidget />
    </footer>
  </>
);

export default Layout;
