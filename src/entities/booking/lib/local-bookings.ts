/**
 * Заявки, оставленные с этого устройства.
 *
 * Гость оставляет заявку без регистрации, и единственный ключ к ней —
 * токен в адресе страницы. Раньше он показывался один раз в модалке
 * и дублировался в localStorage, откуда его никто никогда не читал:
 * закрытая вкладка означала потерянную переписку с гидом.
 *
 * Хранилище браузера — не гарантия (приватное окно, чистка, другое
 * устройство), поэтому оно дополняет письмо со ссылкой, а не заменяет его.
 */

export const LOCAL_BOOKINGS_KEY = 'my-bookings';

/** Страница со списком заявок этого устройства. */
export const MY_BOOKINGS_PATH = '/booking';

/** Сколько токенов держим: список — не архив, а способ вернуться. */
const MAX_LOCAL_BOOKINGS = 50;

/**
 * Сырое значение ключа — снимок внешнего хранилища для `useSyncExternalStore`.
 * Строка, а не массив: снимок обязан быть стабильным между вызовами, иначе
 * React уходит в бесконечный перерендер.
 */
export const getLocalBookingsSnapshot = (): string => {
  try {
    return globalThis.localStorage?.getItem(LOCAL_BOOKINGS_KEY) ?? '';
  } catch {
    return '';
  }
};

/** На сервере хранилища нет — там список всегда пуст. */
export const getServerLocalBookingsSnapshot = (): string => '';

/**
 * Своё же изменение ключа `storage` не замечает: событие приходит только
 * в соседние вкладки. Поэтому запись сопровождается собственным событием —
 * без него ссылка «Мои заявки» в шапке появлялась лишь после перезагрузки,
 * ровно в тот момент, когда человек только что оставил заявку.
 */
const LOCAL_BOOKINGS_EVENT = 'my-bookings:change';

/** Заявку могли оставить в соседней вкладке или прямо в этой — следим за обеими. */
export const subscribeLocalBookings = (onChange: () => void): (() => void) => {
  globalThis.addEventListener?.('storage', onChange);
  globalThis.addEventListener?.(LOCAL_BOOKINGS_EVENT, onChange);

  return () => {
    globalThis.removeEventListener?.('storage', onChange);
    globalThis.removeEventListener?.(LOCAL_BOOKINGS_EVENT, onChange);
  };
};

/** Запись ключа вместе с оповещением своей вкладки. */
const writeTokens = (tokens: string[]): void => {
  globalThis.localStorage?.setItem(
    LOCAL_BOOKINGS_KEY,
    JSON.stringify(tokens.slice(0, MAX_LOCAL_BOOKINGS))
  );
  globalThis.dispatchEvent?.(new Event(LOCAL_BOOKINGS_EVENT));
};

export const parseBookingTokens = (raw: string): string[] => {
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (token): token is string => typeof token === 'string' && !!token
    );
  } catch {
    // В ключе мусор — ведём себя как при пустом списке
    return [];
  }
};

export const readLocalBookingTokens = (): string[] =>
  parseBookingTokens(getLocalBookingsSnapshot());

export const rememberBookingToken = (token: string): void => {
  if (!token) return;

  try {
    const list = readLocalBookingTokens().filter(item => item !== token);

    writeTokens([token, ...list]);
  } catch {
    // localStorage недоступен — не критично, ссылка ушла письмом
  }
};

export const forgetBookingToken = (token: string): void => {
  try {
    writeTokens(readLocalBookingTokens().filter(item => item !== token));
  } catch {
    // см. выше
  }
};
