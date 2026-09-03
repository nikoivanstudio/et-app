'use server';

import { treeifyError } from 'zod';

import { Role } from '@/entities/user/domain';
import { getCurrentUser } from '@/entities/user/server';

import { createApplicationSchema } from '../model/schemas';
import { partnerApplicationService } from '../services/partner-application-service';

export type CreateApplicationFormState = {
  success?: boolean;
  errors?: {
    type?: string;
    agreement?: string;
    _errors?: string;
  };
};

export const createApplicationAction = async (
  state: CreateApplicationFormState,
  formData: FormData
): Promise<CreateApplicationFormState> => {
  const data = Object.fromEntries(formData.entries());
  const result = createApplicationSchema.safeParse(data);

  if (!result.success) {
    const errorTree = treeifyError(result.error);

    return {
      errors: {
        type: errorTree.properties?.type?.errors.join(', '),
        agreement: errorTree.properties?.agreement?.errors.join(', '),
        _errors: errorTree.errors.join(', ') || undefined
      }
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { errors: { _errors: 'Пользователь не авторизован' } };
  }

  // Заявку может подавать только обычный пользователь.
  if (user.role !== Role.USER) {
    return {
      errors: { _errors: 'Вы уже являетесь партнёром или сотрудником' }
    };
  }

  const eitherResult = await partnerApplicationService.createApplication({
    userId: user.id,
    type: result.data.type
  });

  if (eitherResult.type === 'left') {
    return { errors: { _errors: eitherResult.error } };
  }

  return { success: true };
};
