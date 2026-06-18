'use server';

import {
  getCurrentUser,
  sessionService,
  updateUser,
  verifyUserPassword
} from '@/entities/user/server';
import { passwordService } from '@/entities/user/services/password';

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
    const formatedErrors = result.error.format();
    return {
      errors: {
        currentPassword: formatedErrors.currentPassword?._errors.join(', '),
        newPassword: formatedErrors.newPassword?._errors.join(', '),
        confirmPassword: formatedErrors.confirmPassword?._errors.join(', '),
        _errors: formatedErrors._errors.join(', ') || undefined
      }
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { errors: { _errors: 'Пользователь не авторизован' } };
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

  await sessionService.updateSession(updateResult.value);

  return { success: true };
};
