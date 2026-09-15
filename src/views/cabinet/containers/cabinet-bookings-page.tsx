import { FC, Suspense } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { GuideBookingsBoard } from '@/features/booking';
import { CabinetBadges, CabinetIdentity } from '@/features/cabinet/server';

import { CabinetSkeleton } from '@/shared/ui/cabinet';

export const CabinetBookingsPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
}> = ({ identity, badges }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='bookings'
    title='Заявки'
    subtitle='Одна заявка — один клиент, один тур и одна переписка. Слева список, справа карточка выбранной: контакты, действия и история статусов.'
  >
    {/* useSearchParams внутри доски: выбранная заявка живёт в адресе. */}
    <Suspense fallback={<CabinetSkeleton rows={4} />}>
      <GuideBookingsBoard userId={identity.id} />
    </Suspense>
  </CabinetShell>
);
