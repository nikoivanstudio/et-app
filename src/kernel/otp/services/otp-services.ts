import 'server-only';

import { OtpCreateData } from '@/features/otp/domain';

import { otpRepositories } from '@/entities/otp/server';

import { Either, left, right } from '@/shared/lib/either';

import { Otp } from '../../../../generated/prisma/client';
import { otpUtils } from '../lib/otp-utils';

const createOtpRecord = (data: OtpCreateData): Promise<Otp> =>
  otpRepositories.createOtp({ ...data, code: otpUtils.generateOtpCode() });

export type OtpVerifyError =
  | 'otp-not-found'
  | 'otp-expired'
  | 'otp-attempts-exceeded';

/**
 * Проверка кода подтверждения (CRIT-2).
 *
 * Ключевое отличие от прежней версии: код ищется по паре адрес + код, поэтому
 * угаданный код больше не даёт регистрацию на чужой адрес. Дополнительно
 * ведётся счётчик неудачных попыток по последней заявке для этого адреса,
 * что закрывает перебор даже при неограниченном числе запросов.
 */
const verifyOtp = async (
  email: string,
  code: string
): Promise<Either<OtpVerifyError, Otp>> => {
  const latest = await otpRepositories.getLatestOtpByEmail(email);

  if (!latest) {
    return left('otp-not-found');
  }

  if (otpUtils.isAttemptsExceeded(latest.attempts)) {
    return left('otp-attempts-exceeded');
  }

  const otp = await otpRepositories.getOtpByEmailAndCode(email, code);

  if (!otp) {
    // Неверный код расходует попытку — иначе перебор ничем не ограничен
    await otpRepositories.incrementAttempts(latest.id);

    return left('otp-not-found');
  }

  if (otpUtils.isOtpExpired(otp.createdAt)) {
    await otpRepositories.deleteOtpById(otp.id);

    return left('otp-expired');
  }

  return right(otp);
};

const deleteOtp = async (id: number): Promise<Either<string, Otp>> => {
  const deletedOtp = await otpRepositories.deleteOtpById(id);

  if (!deletedOtp) {
    return left(`Возникла ошибка при удаление OTP ${id}`);
  }

  return right(deletedOtp);
};

/** Уборка просроченных записей, чтобы они не накапливались в базе. */
const deleteExpiredOtps = () =>
  otpRepositories.deleteExpiredOtps(
    new Date(Date.now() - otpUtils.EXPIRED_TIME * 1000)
  );

export const otpService = {
  createOtpRecord,
  verifyOtp,
  deleteOtp,
  deleteExpiredOtps
};
