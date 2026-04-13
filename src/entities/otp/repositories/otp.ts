import { dbClient } from '@/shared/lib/db';

import { Otp } from '../../../../generated/prisma/client';

type OtpCreateData = {
  email: string;
  tel: string;
  code: string;
};

const getOtpByCode = (code: string): Promise<Otp | null> =>
  dbClient.otp.findFirst({ where: { code } });

const createOtp = (data: OtpCreateData): Promise<Otp> =>
  dbClient.otp.create({ data });

const deleteOtpById = (id: number): Promise<Otp> =>
  dbClient.otp.delete({ where: { id } });

export const otpRepositories = { getOtpByCode, createOtp, deleteOtpById };
