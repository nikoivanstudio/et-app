import { UserEntity, UserEntityUpdate } from '@/entities/user/domain';

import { dbClient } from '@/shared/lib/db';
import { objectUtils } from '@/shared/lib/object-utils';
import { WithoutNull } from '@/shared/model/types';

import { Prisma, User } from '../../../../generated/prisma/client';

const getUsersCount = (where?: Prisma.UserWhereInput) =>
  dbClient.user.count({ where });

export const saveUser = async (
  user: UserEntity
): Promise<WithoutNull<UserEntity>> =>
  objectUtils.makeWithoutNull(
    await dbClient.user.create({
      data: user
    })
  ) as WithoutNull<UserEntity>;

const updateUser = async (
  user: UserEntityUpdate
): Promise<WithoutNull<UserEntity>> =>
  objectUtils.makeWithoutNull(
    await dbClient.user.update({
      where: { id: user.id },
      data: user
    })
  ) as WithoutNull<UserEntity>;

export async function getUser(
  where: Prisma.UserWhereUniqueInput
): Promise<UserEntity | null> {
  const user = await dbClient.user.findUnique({ where });

  return user ? (objectUtils.makeWithoutNull(user) as UserEntity) : null;
}

const getUsers = () =>
  dbClient.user.findMany({
    omit: {
      passwordHash: true,
      salt: true
    }
  });

const deleteUser = (id: number): Promise<User> =>
  dbClient.user.delete({ where: { id } });

export const userRepository = {
  getUsersCount,
  getUser,
  getUsers,
  saveUser,
  updateUser,
  deleteUser
};
