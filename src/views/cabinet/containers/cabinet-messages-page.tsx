import { FC, Suspense } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { GuideInbox } from '@/features/booking-chat';
import { CabinetBadges, CabinetIdentity } from '@/features/cabinet/server';

import { CabinetSkeleton } from '@/shared/ui/cabinet';

export const CabinetMessagesPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
}> = ({ identity, badges }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='messages'
    title='Сообщения'
    subtitle='Переписка привязана к заявке — отдельной сущности «диалог» в базе нет. Слева заявки с перепиской, справа лента и шапка с туром и датой.'
    fullHeight
  >
    <Suspense fallback={<CabinetSkeleton rows={3} />}>
      <GuideInbox userId={identity.id} />
    </Suspense>
  </CabinetShell>
);
