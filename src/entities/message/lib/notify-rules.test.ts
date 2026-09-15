import {
  ACTIVE_READER_MS,
  NOTIFY_COOLDOWN_MS,
  shouldNotifyAboutMessage
} from './notify-rules';

const now = new Date('2026-09-12T12:00:00.000Z');
const ago = (ms: number) => new Date(now.getTime() - ms);

describe('shouldNotifyAboutMessage: письмо о новом сообщении', () => {
  test('первое сообщение в тишину — пишем', () => {
    expect(
      shouldNotifyAboutMessage({ lastReadAt: null, lastNotifiedAt: null, now })
    ).toBe(true);
  });

  test('получатель сейчас в переписке — не пишем', () => {
    expect(
      shouldNotifyAboutMessage({
        lastReadAt: ago(ACTIVE_READER_MS - 1000),
        lastNotifiedAt: null,
        now
      })
    ).toBe(false);
  });

  test('получатель отошёл — пишем', () => {
    expect(
      shouldNotifyAboutMessage({
        lastReadAt: ago(ACTIVE_READER_MS + 1000),
        lastNotifiedAt: null,
        now
      })
    ).toBe(true);
  });

  test('письмо только что уходило — второе не шлём', () => {
    expect(
      shouldNotifyAboutMessage({
        lastReadAt: null,
        lastNotifiedAt: ago(NOTIFY_COOLDOWN_MS - 1000),
        now
      })
    ).toBe(false);
  });

  test('окно тишины прошло — можно снова', () => {
    expect(
      shouldNotifyAboutMessage({
        lastReadAt: null,
        lastNotifiedAt: ago(NOTIFY_COOLDOWN_MS + 1000),
        now
      })
    ).toBe(true);
  });

  test('давно читал, давно писали — пишем', () => {
    expect(
      shouldNotifyAboutMessage({
        lastReadAt: ago(3 * 60 * 60 * 1000),
        lastNotifiedAt: ago(3 * 60 * 60 * 1000),
        now
      })
    ).toBe(true);
  });
});
