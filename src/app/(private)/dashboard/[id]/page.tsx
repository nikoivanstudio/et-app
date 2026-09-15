import { FC } from 'react';

import { cabinetService, loadCabinetContext } from '@/features/cabinet/server';

import { Role } from '@/entities/user/domain';

import { CabinetOverviewPage } from '@/views/cabinet/server';
import { DashboardSuperAdmin } from '@/views/dashboard/server';

type Props = { params: Promise<{ id: string }> };

/**
 * Корень кабинета. Гид видит «Обзор» нового кабинета, супер-админ —
 * прежний служебный дашборд: у него другая работа (модерация туров,
 * пользователи, заявки партнёров), и в шесть разделов гида она не ложится.
 */
const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { session, identity, badges } = await loadCabinetContext(id);

  if (session.role === Role.SUPER_ADMIN) {
    return <DashboardSuperAdmin session={session} />;
  }

  const overview = await cabinetService.getOverview(session.id);

  return (
    <CabinetOverviewPage
      identity={identity}
      badges={badges}
      overview={overview}
    />
  );
};

export default Page;
