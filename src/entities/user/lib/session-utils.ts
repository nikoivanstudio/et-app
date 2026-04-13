import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/services/session';

const getSession = async (cookies?: string): Promise<SessionEntity> => {
  if (!cookies) {
    throw new Error('Ошибка верификации');
  }

  const { session } = await sessionService.verifySession(cookies);

  if (!session) {
    throw new Error('Ошибка верификации');
  }

  return session;
};

export const sessionUtils = { getSession };
