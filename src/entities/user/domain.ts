import { UserId } from '@/kernel/ids';

export enum Role {
  USER = 'USER',
  GUIDE = 'GUIDE',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  CONTRIBUTOR = 'CONTRIBUTOR',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export type Roles = {
  [K in keyof Role]: Role[K] extends string ? Role[K] : never;
}[keyof Role];

export type UserEntity = {
  id: UserId;
  login: string;
  passwordHash: string;
  phone: string;
  salt: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatarPhotoId?: number;
  email?: string;
  rating?: number;
  slug?: string;
  headline?: string;
  bio?: string;
  coverPhotoId?: number;
  languages?: string[];
  specializations?: string[];
  experienceSince?: number;
  /** Город гида и его машина — публичная карточка в каталоге гидов. */
  city?: string;
  /**
   * Тот же город ключом. Строка выше остаётся до задачи 1-К
   * (см. `docs/geo/plan.md`) и служит подписью, а выборка идёт по ключу.
   */
  cityId?: number;
  vehicle?: string;
  /** Какие письма слать: настраивается в профиле кабинета. */
  notifyNewBooking?: boolean;
  notifyNewMessage?: boolean;
  notifyTripReminder?: boolean;
  notifyNews?: boolean;
};

export type UserEntityUpdate = Partial<UserEntity> & { id: number };

export type SessionEntity = Omit<UserEntity, 'passwordHash' | 'salt'> & {
  expiredAt: string;
  /** Идентификатор записи сессии в БД: позволяет отозвать токен (HIGH-2). */
  sid: string;
};

export const userToSession = (
  user: UserEntity,
  expiredAt: string,
  sid: string
): SessionEntity => {
  const { passwordHash: _, salt: _s, ...userSession } = user;

  return {
    ...userSession,
    expiredAt,
    sid
  };
};
