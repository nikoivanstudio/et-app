import { photoRepository } from '@/entities/photo/repositories/photo';
import { serverPhotoUtils } from '@/entities/photo/server';
import { userRepository } from '@/entities/user/repositories/user';

import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';
import { translit } from '@/shared/lib/string-utils';

import { GuideProfilePayload } from '../model/profile-schemas';

/** Профиль в том виде, в каком он правится в кабинете. */
export type GuideProfileData = GuideProfilePayload & {
  id: number;
  login: string;
  phone: string;
  slug: string;
  avatar: string | null;
  cover: string | null;
};

export type CabinetSession = {
  id: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

const photoSource = async (id?: number | null): Promise<string | null> =>
  id ? ((await photoRepository.getPhotoById(id))?.source ?? null) : null;

async function getProfile(
  userId: number
): Promise<Either<string, GuideProfileData>> {
  const user = await userRepository.getUser({ id: userId });

  if (!user) return left('Пользователь не найден');

  const [avatar, cover] = await Promise.all([
    photoSource(user.avatarPhotoId),
    photoSource(user.coverPhotoId)
  ]);

  return right({
    id: user.id,
    login: user.login,
    phone: user.phone ?? '',
    slug: user.slug ?? String(user.id),
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    headline: user.headline ?? '',
    bio: user.bio ?? '',
    city: user.city ?? '',
    vehicle: user.vehicle ?? '',
    email: user.email ?? '',
    languages: user.languages ?? [],
    specializations: user.specializations ?? [],
    experienceSince: user.experienceSince ?? null,
    notifyNewBooking: user.notifyNewBooking ?? true,
    notifyNewMessage: user.notifyNewMessage ?? true,
    notifyTripReminder: user.notifyTripReminder ?? true,
    notifyNews: user.notifyNews ?? false,
    avatar,
    cover
  });
}

/**
 * Адрес публичной страницы.
 *
 * Slug выдаётся один раз и дальше не меняется: по нему уже стоят ссылки
 * с карточек туров и из писем.
 */
const buildSlug = async (
  userId: number,
  firstName: string,
  lastName: string
): Promise<string | undefined> => {
  const base =
    translit(`${firstName} ${lastName}`.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `guide-${userId}`;

  let candidate = base;
  let suffix = 2;

  for (;;) {
    const existing = await dbClient.user.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!existing) return candidate;
    if (existing.id === userId) return undefined;

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
};

async function saveProfile(
  userId: number,
  payload: GuideProfilePayload
): Promise<Either<string, { id: number }>> {
  const user = await dbClient.user.findUnique({
    where: { id: userId },
    select: { slug: true }
  });

  if (!user) return left('Пользователь не найден');

  const slug =
    user.slug ??
    (await buildSlug(userId, payload.firstName, payload.lastName));

  await dbClient.user.update({
    where: { id: userId },
    data: {
      firstName: payload.firstName || null,
      lastName: payload.lastName || null,
      headline: payload.headline || null,
      bio: payload.bio || null,
      city: payload.city || null,
      vehicle: payload.vehicle || null,
      email: payload.email || null,
      languages: payload.languages,
      specializations: payload.specializations,
      experienceSince: payload.experienceSince,
      notifyNewBooking: payload.notifyNewBooking,
      notifyNewMessage: payload.notifyNewMessage,
      notifyTripReminder: payload.notifyTripReminder,
      notifyNews: payload.notifyNews,
      ...(slug ? { slug } : {})
    }
  });

  return right({ id: userId });
}

/** Аватар и обложка публичной страницы. */
async function savePhoto(
  userId: number,
  kind: 'avatar' | 'cover',
  file: File
): Promise<Either<string, { source: string }>> {
  const entity = await serverPhotoUtils.getPhotoEntity({
    file,
    authorId: userId,
    keywords: [],
    title: kind === 'avatar' ? 'Фото гида' : 'Обложка страницы гида'
  });

  if (!entity) return left('Не удалось загрузить фотографию');

  const photo = await dbClient.photo.create({ data: entity });

  await dbClient.user.update({
    where: { id: userId },
    data:
      kind === 'avatar'
        ? { avatarPhotoId: photo.id }
        : { coverPhotoId: photo.id }
  });

  return right({ source: photo.source });
}

/** Активные сессии — список устройств в профиле. */
async function getSessions(
  userId: number,
  currentSid?: string
): Promise<CabinetSession[]> {
  const rows = await dbClient.session.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });

  return rows.map(row => ({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
    isCurrent: row.id === currentSid
  }));
}

export const cabinetProfileService = {
  getProfile,
  saveProfile,
  savePhoto,
  getSessions
};
