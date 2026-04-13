import { NextRequest } from 'next/server';

import { otpCreateSchema } from '@/features/otp/model/schemas';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { emailNotifications } from '@/shared/services/email-notifications';
import { RegistrationEmail } from '@/shared/ui/registration-email';

import { otpService } from '@/kernel/server';

const errorText = 'Ошибка при отправке кода подтверждения на электронную почту';

export async function postOtp(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const bodyResult = otpCreateSchema.safeParse(body);

    if (!bodyResult.success) {
      throw new Error('Ошибка валидации полученных данных');
    }

    const otp = await otpService.createOtpRecord(bodyResult.data);

    if (process.env.NODE_ENV !== 'production') {
      console.log({ otp });
    }

    if (!otp) {
      throw new Error('OTP receipt error');
    }

    const { code, email } = otp;

    const emailOtp = await emailNotifications.sendToEmail({
      to: email,
      subject: 'Регистрация на сайте Energy-Tour',
      reactNode: RegistrationEmail({ code })
    });

    const success = !emailOtp.error;

    if (!emailOtp) {
      throw new Error('Have not email');
    }

    return handleSuccess({
      body: {
        success,
        content: success
          ? `Код подтверждения успешно отправлен на ваше email - ${bodyResult.data.email}`
          : errorText
      }
    });
  } catch (e) {
    console.error(e);

    return handleError({
      body: {
        success: false,
        content: errorText
      }
    });
  }
}
