import { NextRequest } from 'next/server';

import { applicationFormSchema } from '@/features/application-form/model/schema';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { emailNotifications } from '@/shared/services/email-notifications';
import { CallbackEmail } from '@/shared/ui/callback-email';

export async function postCallbackRequest(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const callbackDataResult = applicationFormSchema.safeParse(body);

    if (!callbackDataResult.success) {
      return handleError({ body: 'Данные формы не валидны' });
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
