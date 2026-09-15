import { Plus } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { formatLongDate } from '@/features/cabinet/lib/format';
import {
  CabinetBadges,
  CabinetIdentity,
  CabinetOverview
} from '@/features/cabinet/server';

import { cabinetAction } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { CabinetOverviewView } from './cabinet-overview';

export const CabinetOverviewPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  overview: CabinetOverview;
}> = ({ identity, badges, overview }) => (
  <CabinetShell
    identity={identity}
    badges={badges}
    section='overview'
    title='Обзор'
    subtitle={`Сегодня ${formatLongDate(new Date().toISOString())} Здесь собрано то, что требует действия: ближайший выезд, неотвеченные сообщения и туры, застрявшие на проверке.`}
    actions={
      <Link
        href={routes.cabinet.newTour(identity.id)}
        className={cabinetAction({ tone: 'gold' })}
      >
        <Plus className='size-4' />
        Создать тур
      </Link>
    }
  >
    <CabinetOverviewView
      userId={identity.id}
      overview={overview}
      hasProfile={!!identity.headline}
    />
  </CabinetShell>
);
