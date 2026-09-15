/**
 * Когда о новом сообщении имеет смысл писать на почту.
 *
 * Переписка по заявке идёт днями, и без письма вторая сторона просто
 * не узнает об ответе: страница опрашивает сервер раз в пятнадцать секунд,
 * но только пока она открыта. При этом письмо на каждую реплику превращает
 * живой диалог в спам, поэтому правило двойное.
 */

/** Не чаще одного письма в это окно на одно направление переписки. */
export const NOTIFY_COOLDOWN_MS = 15 * 60 * 1000;

/**
 * Если получатель читал переписку только что, он в ней и сидит —
 * ответ он увидит сам, письмо будет лишним.
 */
export const ACTIVE_READER_MS = 2 * 60 * 1000;

type NotifyInput = {
  /** Когда получатель последний раз читал сообщения этого отправителя. */
  lastReadAt: Date | null;
  /** Когда получателю последний раз уходило письмо по этой переписке. */
  lastNotifiedAt: Date | null;
  now?: Date;
};

export const shouldNotifyAboutMessage = ({
  lastReadAt,
  lastNotifiedAt,
  now = new Date()
}: NotifyInput): boolean => {
  const moment = now.getTime();

  if (lastReadAt && moment - lastReadAt.getTime() < ACTIVE_READER_MS) {
    return false;
  }

  if (
    lastNotifiedAt &&
    moment - lastNotifiedAt.getTime() < NOTIFY_COOLDOWN_MS
  ) {
    return false;
  }

  return true;
};
