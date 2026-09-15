import { notFound } from 'next/navigation';
import { FC } from 'react';

import { cabinetProfileService, loadCabinetContext } from '@/features/cabinet/server';

import { CabinetProfilePage } from '@/views/cabinet/server';

type Props = { params: Promise<{ id: string }> };

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { identity, badges, session } = await loadCabinetContext(id);

  const [profile, sessions] = await Promise.all([
    cabinetProfileService.getProfile(session.id),
    cabinetProfileService.getSessions(session.id, session.sid)
  ]);

  if (profile.type === 'left') notFound();

  return (
    <CabinetProfilePage
      identity={identity}
      badges={badges}
      profile={profile.value}
      sessions={sessions}
    />
  );
};

export default Page;
