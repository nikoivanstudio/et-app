import { otpUtils } from './otp-utils';

describe('otpUtils', () => {
  describe('generateOtpCode', () => {
    it('генерирует строку с числом', () => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
      expect(otpUtils.generateOtpCode()).toBe(String(Math.ceil(0.5 * 10000)));
      spy.mockRestore();
    });
  });

  describe('isOtpExpired', () => {
    it('возвращает true, если прошло больше 300 секунд', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2020-01-01T00:05:01.000Z'));

      expect(otpUtils.isOtpExpired(new Date('2020-01-01T00:00:00.000Z'))).toBe(
        true
      );

      jest.useRealTimers();
    });

    it('возвращает false, если прошло меньше 300 секунд', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2020-01-01T00:04:00.000Z'));

      expect(otpUtils.isOtpExpired(new Date('2020-01-01T00:00:00.000Z'))).toBe(
        false
      );

      jest.useRealTimers();
    });
  });
});
