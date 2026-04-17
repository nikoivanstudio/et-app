import { UserEntity, UserEntityUpdate } from '@/entities/user/domain';

import { Either, left, Right, right } from '@/shared/lib/either';
import { WithoutNull } from '@/shared/model/types';

import { userRepository } from '../repositories/user';

export const updateUser = async (
  user: UserEntityUpdate
): Promise<Either<string, WithoutNull<UserEntity>>> => {
  const updatedUser = await userRepository.updateUser(user);

  if (!updatedUser) {
    return left('Ошибка обновления данных пользователя');
  }

  return right(updatedUser) as Right<WithoutNull<UserEntity>>;
};
