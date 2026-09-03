import { dbClient } from '@/shared/lib/db';

import { Otp } from '../../../../generated/prisma/client';

type OtpCreateData = {
  email: string;
  tel: string;
  code: string;
};

/**
 * Поиск кода строго по паре email + код (CRIT-2).
 *
 * Прежний `getOtpByCode` искал только по коду, поэтому угаданный код давал
 * регистрацию на чужой email — аккаунт создавался с адресом из найденной записи.
 */
const getOtpByEmailAndCode = (email: string, code: string): Promise<Otp | null> =>
  dbClient.otp.findFirst({
    where: { email, code },
    orderBy: { createdAt: 'desc' }
  });

/** Самая свежая заявка на код для адреса — по ней считаем попытки. */
const getLatestOtpByEmail = (email: string): Promise<Otp | null> =>
  dbClient.otp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });

const createOtp = async (data: OtpCreateData): Promise<Otp> => {
  // Новый запрос кода обнуляет предыдущие: иначе у адреса накапливались
  // одновременно действующие коды, расширяя пространство для подбора.
  await dbClient.otp.deleteMany({ where: { email: data.email } });

  return dbClient.otp.create({ data });
};

const incrementAttempts = (id: number): Promise<Otp> =>
  dbClient.otp.update({
    where: { id },
    data: { attempts: { increment: 1 } }
  });

const deleteOtpById = (id: number): Promise<Otp> =>
  dbClient.otp.delete({ where: { id } });

const deleteExpiredOtps = (olderThan: Date) =>
  dbClient.otp.deleteMany({ where: { createdAt: { lt: olderThan } } });

export const otpRepositories = {
  getOtpByEmailAndCode,
  getLatestOtpByEmail,
  createOtp,
  incrementAttempts,
  deleteOtpById,
  deleteExpiredOtps
};
