import { photoRepository } from '@/entities/photo/repositories/photo';

import { dbClient } from '@/shared/lib/db';

import { buildDisplayName } from '@/kernel/guide/domain';

export type SiteReviewItem = {
  id: number;
  content: string;
  estimateValue: number;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
  tourTitle: string;
  tourSlug: string;
};

export type ReviewsSummary = {
  total: number;
  average: number;
  /** Сколько отзывов на каждую оценку: индекс 0 — «5», индекс 4 — «1». */
  distribution: number[];
};

const REVIEWS_LIMIT = 24;

/**
 * Отзывы для /otzyvy.
 *
 * До v2 на странице отзывов не было ни одного отзыва: она рендерилась тем же
 * шаблоном, что услуги, и показывала свой заголовок в рамке плюс мок
 * «★ 4,9/5» с тремя стоковыми аватарами. Здесь берутся настоящие записи из
 * таблицы review; когда их нет — страница честно говорит об этом.
 */
export const reviewsService = {
  async getSiteReviews(): Promise<{
    items: SiteReviewItem[];
    summary: ReviewsSummary;
  }> {
    const [rows, grouped] = await Promise.all([
      dbClient.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: REVIEWS_LIMIT,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              login: true,
              avatarPhotoId: true
            }
          },
          tour: { select: { title: true, slug: true } }
        }
      }),
      dbClient.review.groupBy({
        by: ['estimateValue'],
        _count: { _all: true }
      })
    ]);

    const avatarIds = [
      ...new Set(
        rows.map(row => row.user.avatarPhotoId).filter((id): id is number => !!id)
      )
    ];
    const avatars = new Map<number, string>();

    await Promise.all(
      avatarIds.map(async id => {
        const photo = await photoRepository.getPhotoById(id);

        if (photo?.source) avatars.set(id, photo.source);
      })
    );

    const distribution = [5, 4, 3, 2, 1].map(
      score =>
        grouped.find(group => group.estimateValue === score)?._count._all ?? 0
    );
    const total = distribution.reduce((sum, count) => sum + count, 0);
    const weighted = distribution.reduce(
      (sum, count, idx) => sum + count * (5 - idx),
      0
    );

    return {
      items: rows.map(row => ({
        id: row.id,
        content: row.content,
        estimateValue: row.estimateValue,
        createdAt: row.createdAt.toISOString(),
        authorName: buildDisplayName(row.user),
        authorAvatar: row.user.avatarPhotoId
          ? avatars.get(row.user.avatarPhotoId)
          : undefined,
        tourTitle: row.tour.title,
        tourSlug: row.tour.slug
      })),
      summary: {
        total,
        average: total ? weighted / total : 0,
        distribution
      }
    };
  }
};
