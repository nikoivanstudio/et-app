/**
 * Почта по заявкам проверяется на заглушках: отправка писем в тесте —
 * это либо сеть, либо реальное письмо живому человеку.
 *
 * Проверяется ровно то, ради чего слой написан: письмо уходит на нужный
 * адрес, а любой отказ почты не должен ломать заявку — она к этому моменту
 * уже создана.
 *
 * @jest-environment node
 */
// `jest` берётся из глобальной области намеренно: SWC поднимает `jest.mock`
// выше импортов только для глобального `jest` — с импортом из '@jest/globals'
// подмена молча не применяется, и в тест уезжает настоящая отправка почты.
// Сами заглушки создаются внутри фабрики: она выполняется раньше, чем
// инициализируются константы файла.
jest.mock('@/shared/services/email-notifications', () => ({
  emailNotifications: { sendToEmail: jest.fn() }
}));

jest.mock('@/shared/lib/security/email-throttle', () => ({
  consumeEmailQuota: jest.fn()
}));

import { consumeEmailQuota } from '@/shared/lib/security/email-throttle';
import { emailNotifications } from '@/shared/services/email-notifications';

import { bookingMailer } from './booking-mailer';

const mockSendToEmail = emailNotifications.sendToEmail as jest.Mock;
const mockConsumeEmailQuota = consumeEmailQuota as unknown as jest.Mock;

const baseArgs = {
  accessToken: 'token-123',
  guestName: 'Мария',
  guestPhone: '+79781112233',
  guestEmail: 'maria@example.com',
  desiredDate: new Date('2026-10-01T00:00:00.000Z'),
  peopleCount: 2,
  comment: null,
  tourTitle: 'Джип-тур на Ай-Петри',
  guideId: 7,
  guideName: 'Сергей Ковалёв',
  guideEmail: 'guide@example.com'
};

const recipients = (): string[] =>
  mockSendToEmail.mock.calls.map(([config]) => (config as { to: string }).to);

describe('bookingMailer.sendBookingCreated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CALLBACK_FROM = 'noreply@example.com';
    mockConsumeEmailQuota.mockReturnValue({
      allowed: true,
      retryAfterMinutes: 0
    });
    mockSendToEmail.mockResolvedValue({ data: { id: 'mail-1' }, error: null });
  });

  test('письма уходят и клиенту, и гиду', async () => {
    const result = await bookingMailer.sendBookingCreated(baseArgs);

    expect(result.clientEmailed).toBe(true);
    expect(recipients()).toEqual(['maria@example.com', 'guide@example.com']);
  });

  test('без адреса клиента письмо ему не уходит, гиду — уходит', async () => {
    const result = await bookingMailer.sendBookingCreated({
      ...baseArgs,
      guestEmail: null
    });

    expect(result.clientEmailed).toBe(false);
    expect(recipients()).toEqual(['guide@example.com']);
  });

  test('без ключа почты не отправляется ничего', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await bookingMailer.sendBookingCreated(baseArgs);

    expect(result.clientEmailed).toBe(false);
    expect(mockSendToEmail).not.toHaveBeenCalled();
  });

  test('исчерпанная квота на адрес письмо отменяет', async () => {
    mockConsumeEmailQuota.mockReturnValue({
      allowed: false,
      retryAfterMinutes: 42
    });

    const result = await bookingMailer.sendBookingCreated(baseArgs);

    expect(result.clientEmailed).toBe(false);
    expect(mockSendToEmail).not.toHaveBeenCalled();
  });

  test('падение почты не выбрасывается наружу: заявка уже создана', async () => {
    mockSendToEmail.mockRejectedValue(new Error('Resend недоступен'));

    await expect(bookingMailer.sendBookingCreated(baseArgs)).resolves.toEqual({
      clientEmailed: false
    });
  });

  test('отказ почтового сервиса виден по полю error', async () => {
    mockSendToEmail.mockResolvedValue({
      data: null,
      error: { message: 'отказ' }
    });

    const result = await bookingMailer.sendBookingCreated(baseArgs);

    expect(result.clientEmailed).toBe(false);
  });
});

describe('bookingMailer.sendMessageNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CALLBACK_FROM = 'noreply@example.com';
    mockConsumeEmailQuota.mockReturnValue({
      allowed: true,
      retryAfterMinutes: 0
    });
    mockSendToEmail.mockResolvedValue({ data: { id: 'mail-2' }, error: null });
  });

  test('уведомление уходит на указанный адрес', async () => {
    const sent = await bookingMailer.sendMessageNotification({
      to: 'maria@example.com',
      authorName: 'Сергей Ковалёв',
      tourTitle: 'Джип-тур на Ай-Петри',
      threadUrl: 'https://energy-tur.ru/booking/token-123'
    });

    expect(sent).toBe(true);
    expect(recipients()).toEqual(['maria@example.com']);
  });

  test('без адреса получателя ничего не шлём', async () => {
    const sent = await bookingMailer.sendMessageNotification({
      to: null,
      authorName: 'Сергей Ковалёв',
      tourTitle: 'Джип-тур на Ай-Петри',
      threadUrl: 'https://energy-tur.ru/booking/token-123'
    });

    expect(sent).toBe(false);
    expect(mockSendToEmail).not.toHaveBeenCalled();
  });
});
