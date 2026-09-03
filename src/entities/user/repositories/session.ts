import { dbClient } from '@/shared/lib/db';

type CreateSessionData = {
  id: string;
  userId: number;
  expiresAt: Date;
};

const createSession = ({ id, userId, expiresAt }: CreateSessionData) =>
  dbClient.session.create({ data: { id, userId, expiresAt } });

/** Активной считается неотозванная и не истёкшая запись. */
const getActiveSession = (id: string) =>
  dbClient.session.findFirst({
    where: { id, revokedAt: null, expiresAt: { gt: new Date() } }
  });

const revokeSession = (id: string) =>
  dbClient.session.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: new Date() }
  });

/** Используется при смене пароля и по кнопке «выйти на всех устройствах». */
const revokeAllUserSessions = (userId: number) =>
  dbClient.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });

const deleteExpiredSessions = () =>
  dbClient.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

export const sessionRepository = {
  createSession,
  getActiveSession,
  revokeSession,
  revokeAllUserSessions,
  deleteExpiredSessions
};
