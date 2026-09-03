import { treeifyError, ZodSafeParseError } from 'zod';

import { SignUpFormStateErrors } from '@/features/auth/domain';

const parseErrors = (
  result: ZodSafeParseError<{
    login: string;
    password: string;
    tel: string;
    code: string;
  }>
): SignUpFormStateErrors => {
  const errorTree = treeifyError(result.error);

  return {
    login: errorTree.properties?.login?.errors.join(', '),
    password: errorTree.properties?.password?.errors.join(', '),
    tel: errorTree.properties?.tel?.errors.join(', '),
    code: errorTree.properties?.code?.errors.join(', '),
    _errors: errorTree.errors.join(', ')
  };
};

export const authErrorsUtils = { parseErrors };
