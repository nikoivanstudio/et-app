'use server';

import { redirect } from 'next/navigation';

import { createUser, sessionService } from '@/entities/user/server';

import { turnstileService } from '@/shared/services/turnstile-service';

import { otpService } from '@/kernel/otp/server';

import { SignUpFormState } from '../domain';
import { authErrorsUtils } from '../lib/auth-errors-utils';
import { formDataSchema } from '../model/schemas';

const isDevMode = process.env.NODE_ENV === 'development';

export const signUpAction = async (
  _: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  const data = Object.fromEntries(formData.entries());

  const turnstileSuccess = await turnstileService.verifyHuman(data);

  if (process.env.NODE_ENV === 'production' && !turnstileSuccess) {
    return {
      formData,
      errors: {
        login: 'Ты не прошел проверку!!!'
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

  const otp = await otpService.verifyOtp(result.data.code);

  if (!otp && !isDevMode) {
    return {
      formData,
      errors: {
        login: 'Ошибка кода подтверждения'
      }
    };
  }

  const createUserResult = await createUser({
    login: isDevMode
      ? result.data.login
      : (
          otp as {
            id: number;
            email: string;
            tel: string;
            createdAt: Date;
            code: string;
          }
        ).email,
    phone: isDevMode
      ? result.data.tel
      : (
          otp as {
            id: number;
            email: string;
            tel: string;
            createdAt: Date;
            code: string;
          }
        ).tel,
    password: result.data.password
  });

  if (createUserResult.type === 'right') {
    await sessionService.addSession(createUserResult.value);

    if (otp && otp.id) {
      await otpService.deleteOtp(otp.id);
    }

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
