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
};

export type UserEntityUpdate = Partial<UserEntity> & { id: number };

export type SessionEntity = Omit<UserEntity, 'passwordHash' | 'salt'> & {
  expiredAt: string;
};

export const userToSession = (
  user: UserEntity,
  expiredAt: string
): SessionEntity => {
  const { passwordHash: _, salt: _s, ...userSession } = user;

  return {
    ...userSession,
    expiredAt
  };
};
