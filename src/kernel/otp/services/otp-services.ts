import 'server-only';

import { OtpCreateData } from '@/features/otp/domain';
import { Otp } from '../../../../generated/prisma/client';
import { OtpError, otpRepositories } from '@/entities/otp/server';
import { otpUtils } from '../lib/otp-utils';
import { Either, left, right } from '@/shared/lib/either';

const createOtpRecord = (data: OtpCreateData): Promise<Otp> =>
  otpRepositories.createOtp({ ...data, code: otpUtils.generateOtpCode() });

const checkOtp = async (
  code: string
): Promise<Either<string, { success: boolean }>> => {
  const otp = await otpRepositories.getOtpByCode(code);

  if (!otp) {
    return left('Такой код не существует');
  }

  const { createdAt } = otp;

  const expired = otpUtils.isOtpExpired(createdAt);

  return right({ success: !expired });
};

const verifyOtp = async (
  code: string
): Promise<{
  id: number;
  email: string;
  tel: string;
  createdAt: Date;
  code: string;
}> => {
  const otp = await otpRepositories.getOtpByCode(code);

  if (!otp) {
    throw new OtpError('Такой код подтверждения не найден!');
  }

  const otpCheckResult = await otpService.checkOtp(otp.code);

  if (otpCheckResult.type === 'left') {
    throw new OtpError(otpCheckResult.error);
  }

  if (!otpCheckResult.value.success) {
    throw new OtpError('Данный код уже просрочен, попробуйте снова!');
  }

  return otp;
};

const deleteOtp = async (id: number): Promise<Either<string, Otp>> => {
  const deletedOtp = await otpRepositories.deleteOtpById(id);

  if (!deletedOtp) {
    return left(`Возникла ошибка при удаление OTP ${id}`);
  }

  return right(deletedOtp);
};

export const otpService = {
  createOtpRecord,
  checkOtp,
  verifyOtp,
  deleteOtp
};
