import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { CabinetBadges, CabinetIdentity } from '@/features/cabinet/server';
import type { TourEditorData } from '@/features/tour-editor';
import { TourEditorForm } from '@/features/tour-editor';

import { routes } from '@/kernel/routes';

export const CabinetTourEditorPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  tour: TourEditorData;
  title: string;
}> = ({ identity, badges, tour, title }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='tours'
    title={title}
    subtitle='Шесть шагов и черновик: пока тур не отправлен на проверку, его видите только вы. Справа — как карточка будет выглядеть у клиента и чего в ней не хватает.'
    breadcrumbs={
      <Link
        href={routes.cabinet.tours(identity.id)}
        className='hover:text-cab-ink flex items-center gap-1.5'
      >
        <ArrowLeft className='size-3.5' />
        Мои туры
      </Link>
    }
  >
    <TourEditorForm userId={identity.id} initial={tour} />
  </CabinetShell>
);
