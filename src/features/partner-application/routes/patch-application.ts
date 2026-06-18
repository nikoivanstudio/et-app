import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { reviewApplicationSchema } from '../model/schemas';
import { partnerApplicationService } from '../services/partner-application-service';

export async function patchApplication(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (
      !roleUtils.userHasPermissionOn(session.role, 'reviewPartnerApplication')
    ) {
      return handleError({
        body: 'У вас нет полномочий на рассмотрение заявок'
      });
    }

    const body = await req.json();
    const result = reviewApplicationSchema.safeParse(body);

    if (!result.success) {
      return handleError({ body: 'Тело запроса неверно' });
    }

    const eitherResult = await partnerApplicationService.reviewApplication(
      result.data
    );

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
