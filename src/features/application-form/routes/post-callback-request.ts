import { NextRequest } from 'next/server';

import { applicationFormSchema } from '@/features/application-form/model/schema';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { consumeEmailQuota } from '@/shared/lib/security/email-throttle';
import { emailNotifications } from '@/shared/services/email-notifications';
import { turnstileService } from '@/shared/services/turnstile-service';
import { CallbackEmail } from '@/shared/ui/callback-email';

export async function postCallbackRequest(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    /**
     * MED-8: раньше этот маршрут отправлял письмо по запросу любого
     * неаутентифицированного клиента без какой-либо проверки «человек ли это».
     */
    if (!(await turnstileService.verifyHuman(body))) {
      return handleError({
        body: 'Не удалось подтвердить, что вы человек. Обновите страницу и попробуйте снова.'
      });
    }

    const callbackDataResult = applicationFormSchema.safeParse(body);

    if (!callbackDataResult.success) {
      return handleError({ body: 'Данные формы не валидны' });
    }

    const quota = consumeEmailQuota('callback', process.env.CALLBACK_TO || '');

    if (!quota.allowed) {
      return handleError({
        body: 'Слишком много заявок. Попробуйте позже.',
        status: 429
      });
    }

    const { name, phone, description } = callbackDataResult.data;

    const createEmailResponse = await emailNotifications.sendToEmail({
      to: process.env.CALLBACK_TO || '',
      subject: 'Заявка на обратный звонок',
      reactNode: CallbackEmail({ name, phone, message: description })
    });

    if (!createEmailResponse.data?.id) {
      throw new Error();
    }

    return handleSuccess({
      body: 'Заявка успешно отправлена. Ожидайте обратного звонка'
    });
  } catch (e) {
    console.error(e);

    return handleError({
      body: 'Ошибка на сервере. Во время отправки заявки на обратный звонок.'
    });
  }
}
