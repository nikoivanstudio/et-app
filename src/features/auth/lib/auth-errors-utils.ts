import { SafeParseError } from 'zod';

import { SignUpFormStateErrors } from '@/features/auth/domain';

const parseErrors = (
  result: SafeParseError<{
    login: string;
    password: string;
    tel: string;
    code: string;
  }>
): SignUpFormStateErrors => {
  const formatedErrors = result.error.format();

  return {
    login: formatedErrors.login?._errors.join(', '),
    password: formatedErrors.password?._errors.join(', '),
    tel: formatedErrors.tel?._errors.join(', '),
    code: formatedErrors.code?._errors.join(', '),
    _errors: formatedErrors._errors.join(', ')
  };
};

export const authErrorsUtils = { parseErrors };
