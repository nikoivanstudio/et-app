import { notFound } from 'next/navigation';
import { FC } from 'react';

import { loadCabinetContext } from '@/features/cabinet/server';
import { tourEditorService } from '@/features/tour-editor/server';

import { CabinetTourEditorPage } from '@/views/cabinet/server';

type Props = { params: Promise<{ id: string; tourId: string }> };

const Page: FC<Props> = async ({ params }) => {
  const { id, tourId } = await params;
  const { identity, badges, session } = await loadCabinetContext(id);
  const numericId = Number(tourId);

  if (!Number.isInteger(numericId)) notFound();

  // Тур целиком читается на сервере: редактор открывается заполненным,
  // без промежуточного состояния загрузки на клиенте.
  const result = await tourEditorService.getEditorTour(numericId, session.id);

  if (result.type === 'left') notFound();

  return (
    <CabinetTourEditorPage
      identity={identity}
      badges={badges}
      tour={result.value}
      title={result.value.title}
    />
  );
};

export default Page;
