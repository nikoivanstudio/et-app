import { FC } from 'react';

import { loadCabinetContext } from '@/features/cabinet/server';
import { tourEditorService } from '@/features/tour-editor/server';

import { CabinetToursPage } from '@/views/cabinet/server';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

const Page: FC<Props> = async ({ params, searchParams }) => {
  const { id } = await params;
  const { status } = await searchParams;
  const { identity, badges, session } = await loadCabinetContext(id);
  const result = await tourEditorService.getGuideTours(session.id);

  return (
    <CabinetToursPage
      identity={identity}
      badges={badges}
      tours={result.type === 'right' ? result.value.tours : []}
      filter={status}
    />
  );
};

export default Page;
