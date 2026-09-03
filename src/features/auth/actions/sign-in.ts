'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { sessionService, verifyUserPassword } from '@/entities/user/server';

import {
  authThrottleMessage,
  consumeAuthAttempt
} from '@/shared/lib/security/auth-throttle';
import { turnstileService } from '@/shared/services/turnstile-service';

export type SignInFormState = {
  formData?: FormData;
  errors?: {
    login?: string;
    password?: string;
    _errors?: string;
  };
};

const formDataSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(3)
});

export const signInAction = async (
  state: SignInFormState,
  formData: FormData
): Promise<SignInFormState> => {
  const data = Object.fromEntries(formData.entries());
  const result = formDataSchema.safeParse(data);

  if (!result.success) {
    const formatedErrors = result.error.format();

    return {
      formData,
      errors: {
        login: formatedErrors.login?._errors.join(', '),
        password: formatedErrors.password?._errors.join(', '),
        _errors: formatedErrors._errors.join(', ')
      }
    };
  }

  /**
   * HIGH-1: ограничение попыток. Расходуется до проверки пароля, поэтому
   * неудачные попытки учитываются независимо от результата.
   */
  const throttle = await consumeAuthAttempt('sign-in', result.data.login);

  if (!throttle.allowed) {
    return {
      formData,
      errors: { _errors: authThrottleMessage(throttle) }
    };
  }

  /**
   * HIGH-1: виджет Turnstile уже присутствовал на форме входа, но его токен
   * никогда не проверялся — капча была декорацией.
   */
  if (!(await turnstileService.verifyHuman(data))) {
    return {
      formData,
      errors: { _errors: 'Не удалось подтвердить, что вы человек.' }
    };
  }

  const verifyUserResult = await verifyUserPassword(result.data);

  if (verifyUserResult.type === 'right') {
    await sessionService.addSession(verifyUserResult.value);

    redirect('/');
  }

  return {
    formData,
    errors: {
      _errors: 'Неверный логин или пароль'
    }
  };
};
