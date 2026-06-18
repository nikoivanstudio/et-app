'use server';

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
    const formatedErrors = result.error.format();

    return {
      errors: {
        type: formatedErrors.type?._errors.join(', '),
        agreement: formatedErrors.agreement?._errors.join(', '),
        _errors: formatedErrors._errors.join(', ') || undefined
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
