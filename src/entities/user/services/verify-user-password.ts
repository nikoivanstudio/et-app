import { left, right } from '@/shared/lib/either';

import { Prisma } from '../../../../generated/prisma/client';
import { userRepository } from '../repositories/user';

import { passwordService } from './password';

export async function verifyUserPassword({
  login,
  password
}: {
  login: string;
  password: string;
}) {
  const user = await userRepository.getUser({
    login
  } as Prisma.UserWhereUniqueInput);

  if (!user) {
    return left('Неверный логин или пароль' as const);
  }

  const isCompare = await passwordService.comparePasswords({
    hash: user.passwordHash,
    salt: user.salt,
    password
  });

  if (!isCompare) {
    return left('Неверный логин или пароль' as const);
  }

  return right(user);
}
