'use server';

import { treeifyError } from 'zod';

import {
  getCurrentUser,
  sessionService,
  updateUser,
  verifyUserPassword
} from '@/entities/user/server';
import { passwordService } from '@/entities/user/services/password';

import {
  authThrottleMessage,
  consumeAuthAttempt
} from '@/shared/lib/security/auth-throttle';

import { changePasswordSchema } from '../model/schemas';

export type ChangePasswordFormState = {
  success?: boolean;
  errors?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    _errors?: string;
  };
};

export const changePasswordAction = async (
  state: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> => {
  const data = Object.fromEntries(formData.entries());
  const result = changePasswordSchema.safeParse(data);

  if (!result.success) {
    const errorTree = treeifyError(result.error);
    return {
      errors: {
        currentPassword:
          errorTree.properties?.currentPassword?.errors.join(', '),
        newPassword: errorTree.properties?.newPassword?.errors.join(', '),
        confirmPassword:
          errorTree.properties?.confirmPassword?.errors.join(', '),
        _errors: errorTree.errors.join(', ') || undefined
      }
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { errors: { _errors: 'Пользователь не авторизован' } };
  }

  // HIGH-1: подбор текущего пароля через эту форму тоже должен быть ограничен
  const throttle = await consumeAuthAttempt('change-password', user.login);

  if (!throttle.allowed) {
    return { errors: { _errors: authThrottleMessage(throttle) } };
  }

  const verifyResult = await verifyUserPassword({
    login: user.login,
    password: result.data.currentPassword
  });

  if (verifyResult.type === 'left') {
    return { errors: { currentPassword: 'Неверный текущий пароль' } };
  }

  const { hash, salt } = await passwordService.hashPassword(
    result.data.newPassword
  );

  const updateResult = await updateUser({
    id: user.id,
    passwordHash: hash,
    salt
  });

  if (updateResult.type !== 'right') {
    return { errors: { _errors: 'Не удалось обновить пароль' } };
  }

  /**
   * HIGH-2: смена пароля завершает ВСЕ сессии пользователя. Раньше обновлялась
   * только cookie текущего браузера, а во всех остальных сессиях прежний токен
   * продолжал работать — атакующий не вытеснялся сменой пароля.
   */
  await sessionService.revokeAllSessions(user.id);
  await sessionService.updateSession(updateResult.value);

  return { success: true };
};
