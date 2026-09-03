'use server';

import { redirect } from 'next/navigation';

import { createUser, sessionService } from '@/entities/user/server';

import {
  authThrottleMessage,
  consumeAuthAttempt
} from '@/shared/lib/security/auth-throttle';
import { turnstileService } from '@/shared/services/turnstile-service';

import { otpService } from '@/kernel/otp/server';

import { SignUpFormState } from '../domain';
import { authErrorsUtils } from '../lib/auth-errors-utils';
import { formDataSchema } from '../model/schemas';

const OTP_ERROR_TEXT: Record<string, string> = {
  'otp-not-found': 'Неверный код подтверждения',
  'otp-expired': 'Код подтверждения истёк, запросите новый',
  'otp-attempts-exceeded':
    'Превышено число попыток ввода кода. Запросите новый код.'
};

export const signUpAction = async (
  _: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  const data = Object.fromEntries(formData.entries());

  /**
   * MED-2: проверка больше не обходится через NODE_ENV. Решение о том,
   * применять ли капчу, принимает turnstileService на основе конфигурации,
   * и в production ключ Turnstile обязателен.
   */
  if (!(await turnstileService.verifyHuman(data))) {
    return {
      formData,
      errors: {
        login: 'Не удалось подтвердить, что вы человек.'
      }
    };
  }

  const result = formDataSchema.safeParse(data);

  if (!result.success) {
    return {
      formData,
      errors: authErrorsUtils.parseErrors(result)
    };
  }

  // HIGH-1: перебор кода подтверждения ограничивается так же, как вход
  const throttle = await consumeAuthAttempt('sign-up', result.data.login);

  if (!throttle.allowed) {
    return {
      formData,
      errors: { _errors: authThrottleMessage(throttle) }
    };
  }

  /**
   * CRIT-2: код проверяется по паре «введённый email + код». Раньше поиск шёл
   * только по коду, и угаданное значение давало регистрацию с email
   * и телефоном другого человека.
   */
  const otpResult = await otpService.verifyOtp(
    result.data.login,
    result.data.code
  );

  // MED-2: проверка кода обязательна во всех окружениях — прежняя ветка
  // `!isDevMode` полностью отключала её вне production
  if (otpResult.type === 'left') {
    return {
      formData,
      errors: {
        code: OTP_ERROR_TEXT[otpResult.error] || 'Ошибка кода подтверждения'
      }
    };
  }

  const verifiedOtp = otpResult.value;

  const createUserResult = await createUser({
    // Адрес и телефон берутся только из подтверждённой записи
    login: verifiedOtp.email,
    phone: verifiedOtp.tel,
    password: result.data.password
  });

  if (createUserResult.type === 'right') {
    await otpService.deleteOtp(verifiedOtp.id);

    await sessionService.addSession(createUserResult.value);

    redirect('/');
  }

  return {
    formData,
    errors: {
      _errors:
        createUserResult.type === 'left'
          ? {
              'user-login-exists': 'Пользователь с таким login существует'
            }[createUserResult.error]
          : undefined
    }
  };
};
