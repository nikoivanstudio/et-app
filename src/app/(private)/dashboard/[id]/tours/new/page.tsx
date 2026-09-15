import { FC } from 'react';

import { loadCabinetContext } from '@/features/cabinet/server';
import { emptyTourEditorData } from '@/features/tour-editor/server';

import { CabinetTourEditorPage } from '@/views/cabinet/server';

type Props = { params: Promise<{ id: string }> };

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { identity, badges } = await loadCabinetContext(id);

  return (
    <CabinetTourEditorPage
      identity={identity}
      badges={badges}
      tour={emptyTourEditorData()}
      title='Новый тур'
    />
  );
};

export default Page;
