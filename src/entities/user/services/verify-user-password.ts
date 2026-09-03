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
    /**
     * MED-9: холостая проверка той же стоимости. Раньше при неизвестном логине
     * функция возвращалась мгновенно, и по времени ответа можно было
     * определить, существует ли учётная запись.
     */
    await passwordService.dummyCompare(password);

    return left('Неверный логин или пароль' as const);
  }

  const { matches, needsRehash } = await passwordService.comparePasswords({
    hash: user.passwordHash,
    salt: user.salt,
    password
  });

  if (!matches) {
    return left('Неверный логин или пароль' as const);
  }

  /**
   * CRIT-4: прозрачная миграция со старого PBKDF2/1000 на scrypt.
   * Открытый пароль есть только здесь, поэтому пересчитываем именно
   * в момент успешного входа — сбрасывать пароли пользователям не нужно.
   */
  if (needsRehash) {
    try {
      const { hash, salt } = await passwordService.hashPassword(password);

      await userRepository.updateUser({
        id: user.id,
        passwordHash: hash,
        salt
      });

      return right({ ...user, passwordHash: hash, salt });
    } catch (error) {
      // Неудачный пересчёт не должен мешать входу: пароль уже подтверждён
      console.error('Не удалось обновить хеш пароля', error);
    }
  }

  return right(user);
}
