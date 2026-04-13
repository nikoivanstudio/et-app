import { userRepository } from '@/entities/user/server';

import { Either, left, right } from '@/shared/lib/either';

import { Prisma, User } from '../../../../generated/prisma/client';
import { GetUserResponse } from '../domain';

const getPagesCount = async (where?: Prisma.UserWhereInput) => {
  const count = await userRepository.getUsersCount(where);

  return Math.ceil(count / 10);
};

const getUsers = async (): Promise<Either<string, GetUserResponse>> => {
  const users: Omit<User, 'passwordHash' | 'salt'>[] =
    await userRepository.getUsers();

  const pagesCount = await getPagesCount();

  if (!users) return left('Ошибка получения пользователей');

  return right({
    pagesCount,
    users
  });
};

const deleteUser = async (id: number): Promise<Either<string, User>> => {
  const user = await userRepository.deleteUser(id);

  if (!user) return left('Ошибка удаления пользователя');

  return right(user);
};

export const userServices = { getUsers, deleteUser };
