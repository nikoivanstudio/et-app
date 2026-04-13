import 'server-only';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { left, right } from '@/shared/lib/either';

import { SessionEntity, UserEntity, userToSession } from '../domain';

const isProd = process.env.NODE_ENV === 'production';
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionEntity) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256']
    });
    return right(payload as SessionEntity);
  } catch (error) {
    return left(error);
  }
}

async function addSession(user: UserEntity): Promise<void> {
  const expiresAt = new Date(
    Date.now() + (isProd ? 1 : 7 * 24) * 60 * 60 * 1000
  );
  const sessionData = userToSession(user, expiresAt.toISOString());
  const session = await encrypt(sessionData);
  const cookiesStore = await cookies();

  cookiesStore.delete('session');

  cookiesStore.set('session', session, {
    httpOnly: true,
    // secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

async function updateSession(user: UserEntity) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionData = userToSession(user, expiresAt.toISOString());
  const session = await encrypt(sessionData);
  const cookiesStore = await cookies();

  cookiesStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

const getSessionCookies = () => cookies().then(c => c.get('session')?.value);

const verifySession = async (cookies?: string) => {
  const session = await decrypt(cookies || (await getSessionCookies()));

  const isAuth = session.type === 'right';

  return { isAuth, session: isAuth ? session.value : null };
};

const verifySessionWithRedirect = async (getCookies = getSessionCookies) => {
  const cookie = await getCookies();
  const session = await decrypt(cookie);

  if (session.type === 'left') {
    redirect('/sign-in');
  }

  return { isAuth: true, session: session.value };
};

export const sessionService = {
  addSession,
  updateSession,
  deleteSession,
  verifySession,
  verifySessionWithRedirect
};
