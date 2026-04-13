import { SignUpFormState } from '@/features/auth/domain';

import { TurnstileError } from '@/shared/model/turnstile-error';

const handleErrors = (e: unknown, formData?: FormData): SignUpFormState => {
  if (e instanceof TurnstileError) {
    return {
      formData,
      errors: {
        login: e.message
      }
    };
  }

  return {
    formData,
    errors: {
      login: 'Пользователь с таким login существует'
    }
  };
};

export const signUpService = { handleErrors };
