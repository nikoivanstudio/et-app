import { Role } from '@/entities/user/domain';

import { left, right } from '@/shared/lib/either';

import { Prisma } from '../../../../generated/prisma/client';
import { userRepository } from '../repositories/user';

import { passwordService } from './password';
import UserWhereUniqueInput = Prisma.UserWhereUniqueInput;

type CreateUserData = {
  login: string;
  password: string;
  phone: string;
};

export const createUser = async ({
  login,
  password,
  phone
}: CreateUserData) => {
  const userWithLogin = await userRepository.getUser({
    login
  } as UserWhereUniqueInput);

  if (userWithLogin) {
    return left('user-login-exists' as const);
  }

  const { hash, salt } = await passwordService.hashPassword(password);

  const user = await userRepository.saveUser({
    id: Math.round(Math.random() * 1000),
    login,
    phone,
    passwordHash: hash,
    salt,
    role: Role.USER
  });

  return right(user);
};
