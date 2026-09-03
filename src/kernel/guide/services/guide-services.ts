import { photoRepository } from '@/entities/photo/repositories/photo';
import { isEstimation } from '@/entities/review';
import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';
import { PageMetaData } from '@/shared/model/types';

import {
  buildDisplayName,
  GUIDE_ROLES,
  GuideProfile,
  GuideReviewItem,
  GuideSummary,
  GuideTourCardItem,
  isGuideRole
} from '@/kernel/guide/domain';

import { User } from '../../../../generated/prisma/client';

const resolvePhotoSource = async (
  id?: number | null
): Promise<string | undefined> => {
  if (!id) return undefined;
  const photo = await photoRepository.getPhotoById(id);

  return photo?.source ?? undefined;
};

// Пакетно разрешает источники фото по списку id → Map<id, source>.
const resolvePhotoSources = async (
  ids: number[]
): Promise<Map<number, string>> => {
  const unique = [...new Set(ids.filter(Boolean))];
  const photos = await photoRepository.getPhotosByIds(unique);

  return new Map(photos.map(photo => [photo.id, photo.source]));
};

const getRating = async (user: User): Promise<number> => {
  if (typeof user.rating === 'number') return user.rating;

  const aggregate = await dbClient.review.aggregate({
    _avg: { estimateValue: true },
    where: { tour: { authorId: user.id } }
  });

  return Number(aggregate._avg.estimateValue ?? 0);
};

const buildSummary = async (user: User): Promise<GuideSummary> => {
  const [toursCount, reviewsCount, rating, avatarPhoto] = await Promise.all([
    dbClient.tour.count({
      where: { authorId: user.id, status: PUBLIC_TOUR_STATUS }
    }),
    dbClient.review.count({ where: { tour: { authorId: user.id } } }),
    getRating(user),
    resolvePhotoSource(user.avatarPhotoId)
  ]);

  return {
    id: user.id,
    slug: user.slug ?? String(user.id),
    displayName: buildDisplayName(user),
    headline: user.headline ?? undefined,
    avatarPhoto,
    isVerified: isGuideRole(user.role),
    rating: Number(rating.toFixed(1)),
    reviewsCount,
    toursCount
  };
};

async function getGuideSummary(
  authorId: number
): Promise<Either<string, GuideSummary>> {
  const user = await dbClient.user.findUnique({ where: { id: authorId } });

  if (!user) {
    return left('Гид не найден');
  }

  return right(await buildSummary(user));
}

// Принимает slug или числовой id (для гидов без slug).
const findGuideUser = async (slugOrId: string): Promise<User | null> => {
  const bySlug = await dbClient.user.findUnique({ where: { slug: slugOrId } });

  if (bySlug) return bySlug;

  const id = Number(slugOrId);

  return Number.isInteger(id) && id > 0
    ? dbClient.user.findUnique({ where: { id } })
    : null;
};

async function getGuideBySlug(
  slugOrId: string
): Promise<Either<string, GuideProfile>> {
  const user = await findGuideUser(slugOrId);

  if (!user) {
    return left('Гид с указанным адресом не найден');
  }

  const [summary, coverPhoto, tourRows, reviewRows] = await Promise.all([
    buildSummary(user),
    resolvePhotoSource(user.coverPhotoId),
    dbClient.tour.findMany({
      where: { authorId: user.id, status: PUBLIC_TOUR_STATUS },
      orderBy: { createdAt: 'desc' },
      include: { photos: { select: { id: true, source: true } } }
    }),
    dbClient.review.findMany({
      where: { tour: { authorId: user.id } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            login: true,
            avatarPhotoId: true
          }
        }
      }
    })
  ]);

  const tours: GuideTourCardItem[] = tourRows.map(tour => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    mainPhoto: tour.photos.find(photo => photo.id === tour.mainPhotoId)?.source,
    price: tour.price,
    rating: tour.rating ?? 0
  }));

  const reviewerAvatars = await resolvePhotoSources(
    reviewRows.map(review => review.user.avatarPhotoId ?? 0)
  );

  const reviews: GuideReviewItem[] = reviewRows
    .filter(review => isEstimation(review.estimation))
    .map(review => ({
      id: review.id,
      content: review.content,
      estimation: review.estimation as GuideReviewItem['estimation'],
      estimateValue: review.estimateValue,
      createdAt: review.createdAt.toISOString(),
      authorName: buildDisplayName(review.user),
      authorAvatar: review.user.avatarPhotoId
        ? reviewerAvatars.get(review.user.avatarPhotoId)
        : undefined
    }));

  const experienceYears = user.experienceSince
    ? Math.max(0, new Date().getFullYear() - user.experienceSince)
    : undefined;

  return right({
    ...summary,
    bio: user.bio ?? undefined,
    coverPhoto,
    languages: user.languages ?? [],
    specializations: user.specializations ?? [],
    experienceYears,
    experienceSince: user.experienceSince ?? undefined,
    tours,
    reviews
  });
}

async function getGuideMetaData(
  slugOrId: string
): Promise<Either<string, PageMetaData>> {
  const user = await findGuideUser(slugOrId);

  if (!user) {
    return left('Гид с указанным адресом не найден');
  }

  const displayName = buildDisplayName(user);
  const title = `${displayName}${user.headline ? ` — ${user.headline}` : ' — гид'}`;

  return right({
    title,
    description:
      user.bio?.slice(0, 160) ||
      `Авторские туры и экскурсии от гида ${displayName}.`,
    keywords: [displayName, 'гид', 'экскурсии', 'туры', ...user.specializations]
  });
}

/**
 * Гиды для sitemap: slug (или id, если slug не задан) и дата правки.
 *
 * Раздел /guide/[slug] в sitemap не попадал вообще. Берём только гидов
 * хотя бы с одним опубликованным туром: у остальных страница пустая, и в
 * индексе ей делать нечего. `findGuideUser` умеет резолвить и числовой id,
 * поэтому гид без slug получает адрес /guide/{id} — рабочий.
 */
async function getGuideRefs(): Promise<
  { slug: string; lastModified: Date | null }[]
> {
  const users = await dbClient.user.findMany({
    where: {
      role: { in: GUIDE_ROLES },
      tours: { some: { status: PUBLIC_TOUR_STATUS } }
    },
    select: { id: true, slug: true, updatedAt: true, createdAt: true }
  });

  return users.map(user => ({
    slug: user.slug ?? String(user.id),
    lastModified: user.updatedAt ?? user.createdAt
  }));
}

export const guideServices = {
  getGuideRefs,
  getGuideSummary,
  getGuideBySlug,
  getGuideMetaData
};
