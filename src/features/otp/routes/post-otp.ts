import { NextRequest } from 'next/server';

import { otpCreateSchema } from '@/features/otp/model/schemas';

import { serverEnv } from '@/shared/config/env';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { consumeEmailQuota } from '@/shared/lib/security/email-throttle';
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

    /**
     * MED-8: лимит на конкретный адрес получателя. Ограничение по IP
     * в middleware не мешает засыпать письмами один и тот же ящик
     * из разных сетей.
     */
    const quota = consumeEmailQuota('otp', bodyResult.data.email);

    if (!quota.allowed) {
      return handleError({
        body: `Слишком много запросов кода на этот адрес. Повторите через ${quota.retryAfterMinutes} мин.`,
        status: 429
      });
    }

    // CRIT-2: просроченные записи не должны накапливаться в таблице
    await otpService.deleteExpiredOtps();

    const otp = await otpService.createOtpRecord(bodyResult.data);

    // MED-6: код печатается только при явно выставленном OTP_DEBUG_LOG=true
    // и никогда в production
    if (serverEnv.isOtpDebugLogEnabled) {
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

    return handleError({ body: errorText });
  }
}
