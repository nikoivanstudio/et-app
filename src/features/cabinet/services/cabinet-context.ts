import { redirect } from 'next/navigation';

import { roleUtils } from '@/entities/user';
import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/services/session';

import { routes } from '@/kernel/routes';

import { cabinetService } from './cabinet-service';
import { CabinetBadges, CabinetIdentity } from './cabinet-service';

export type CabinetContext = {
  session: SessionEntity;
  identity: CabinetIdentity;
  badges: CabinetBadges;
};

/**
 * Общее начало всех страниц кабинета: сессия, гид и счётчики меню.
 *
 * Идентификатор в адресе (`/dashboard/[id]`) остался от прежнего дашборда и
 * нужен ссылкам из писем. Данные всё равно берутся по сессии, поэтому чужой
 * id не открывает чужой кабинет — просто отправляет в свой.
 */
export async function loadCabinetContext(
  routeUserId?: string
): Promise<CabinetContext> {
  const { session } = await sessionService.verifySessionWithRedirect();

  if (!session || !roleUtils.userHasPermissionOn(session.role, 'dashboard')) {
    redirect('/');
  }

  if (routeUserId && routeUserId !== String(session.id)) {
    redirect(routes.cabinet.overview(session.id));
  }

  const [identity, badges] = await Promise.all([
    cabinetService.getIdentity(session.id),
    cabinetService.getBadges(session.id)
  ]);

  if (!identity) {
    redirect('/');
  }

  return { session, identity, badges };
}
