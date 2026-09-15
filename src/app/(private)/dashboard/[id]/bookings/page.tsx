import { FC } from 'react';

import { loadCabinetContext } from '@/features/cabinet/server';

import { CabinetBookingsPage } from '@/views/cabinet/server';

type Props = { params: Promise<{ id: string }> };

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { identity, badges } = await loadCabinetContext(id);

  return <CabinetBookingsPage identity={identity} badges={badges} />;
};

export default Page;
