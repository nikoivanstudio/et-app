import 'server-only';

import { randomUUID } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { serverEnv } from '@/shared/config/env';
import { left, right } from '@/shared/lib/either';

import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS
} from '../constants/session-cookie';
import { SessionEntity, UserEntity, userToSession } from '../domain';
import { sessionRepository } from '../repositories/session';

/**
 * Имя cookie до исправления CRIT-1. Удаляем её при каждой выдаче и очистке
 * сессии, чтобы у пользователей не оставалось старой небезопасной cookie.
 */
const LEGACY_COOKIE_NAME = 'session';

/**
 * Ключ читается лениво и с проверкой длины (HIGH-7): раньше отсутствующий
 * SESSION_SECRET давал пустой ключ подписи.
 */
let cachedKey: Uint8Array | null = null;

const getEncodedKey = (): Uint8Array => {
  if (!cachedKey) {
    cachedKey = new TextEncoder().encode(serverEnv.sessionSecret);
  }

  return cachedKey;
};

async function encrypt(
  payload: SessionEntity,
  expiresAt: Date
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // Срок жизни токена совпадает со сроком жизни cookie и записи в БД (HIGH-2)
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getEncodedKey());
}

async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256']
    });

    return right(payload as SessionEntity);
  } catch (error) {
    return left(error);
  }
}

const buildCookieOptions = (expires: Date) =>
  ({
    httpOnly: true,
    // CRIT-1: без этого флага cookie сессии уходила и по открытому HTTP
    secure: true,
    sameSite: 'lax' as const,
    expires,
    path: '/'
  }) as const;

async function issueSession(user: UserEntity): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const sid = randomUUID();

  await sessionRepository.createSession({
    id: sid,
    userId: user.id,
    expiresAt
  });

  const sessionData = userToSession(user, expiresAt.toISOString(), sid);
  const token = await encrypt(sessionData, expiresAt);
  const cookiesStore = await cookies();

  cookiesStore.delete(LEGACY_COOKIE_NAME);
  cookiesStore.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));
}

/** Вход: создаётся новая запись сессии. */
async function addSession(user: UserEntity): Promise<void> {
  await issueSession(user);
}

/**
 * Перевыдача сессии (например, после смены пароля). Прежние записи к этому
 * моменту уже должны быть отозваны вызывающей стороной.
 */
async function updateSession(user: UserEntity): Promise<void> {
  await issueSession(user);
}

/** Выход: запись отзывается в БД, а не только удаляется cookie. */
async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const decrypted = await decrypt(token);

    if (decrypted.type === 'right' && decrypted.value.sid) {
      await sessionRepository.revokeSession(decrypted.value.sid);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(LEGACY_COOKIE_NAME);
}

/** Завершение всех сессий пользователя. */
async function revokeAllSessions(userId: number): Promise<void> {
  await sessionRepository.revokeAllUserSessions(userId);
}

const getSessionCookies = () =>
  cookies().then(c => c.get(SESSION_COOKIE_NAME)?.value);

type VerifyResult = { isAuth: boolean; session: SessionEntity | null };

const verifySession = async (cookie?: string): Promise<VerifyResult> => {
  const decrypted = await decrypt(cookie || (await getSessionCookies()));

  if (decrypted.type === 'left') {
    return { isAuth: false, session: null };
  }

  const session = decrypted.value;

  // HIGH-7: поле expiredAt раньше клали в токен, но никогда не проверяли
  if (!session.expiredAt || new Date(session.expiredAt).getTime() < Date.now()) {
    return { isAuth: false, session: null };
  }

  // HIGH-2: подписи недостаточно — сессия должна быть жива в БД
  if (!session.sid) {
    return { isAuth: false, session: null };
  }

  const active = await sessionRepository.getActiveSession(session.sid);

  if (!active || active.userId !== session.id) {
    return { isAuth: false, session: null };
  }

  return { isAuth: true, session };
};

const verifySessionWithRedirect = async (getCookies = getSessionCookies) => {
  const cookie = await getCookies();
  const { isAuth, session } = await verifySession(cookie);

  if (!isAuth || !session) {
    redirect('/sign-in');
  }

  return { isAuth: true as const, session };
};

export const sessionService = {
  addSession,
  updateSession,
  deleteSession,
  revokeAllSessions,
  verifySession,
  verifySessionWithRedirect
};
