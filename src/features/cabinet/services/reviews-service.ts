import { isEstimation } from '@/entities/review';

import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';

import { buildDisplayName } from '@/kernel/guide/domain';

/** Отзыв в кабинете: с туром, оценками по критериям и ответом гида. */
export type CabinetReview = {
  id: number;
  content: string;
  estimateValue: number;
  estimation: { guideWork: number; informationQuality: number; trailQuality: number };
  createdAt: string;
  authorName: string;
  tourId: number;
  tourTitle: string;
  tourSlug: string;
  guideReply: string | null;
  guideReplyAt: string | null;
};

export type CabinetReviewsSummary = {
  reviews: CabinetReview[];
  rating: number;
  total: number;
  unanswered: number;
  /** Сколько отзывов с каждой оценкой — столбики распределения. */
  distribution: { score: number; count: number }[];
  /** Средние по критериям: по ним видно, что чинить. */
  criteria: { guideWork: number; informationQuality: number; trailQuality: number };
};

const EMPTY_ESTIMATION = {
  guideWork: 0,
  informationQuality: 0,
  trailQuality: 0
};

const average = (values: number[]): number =>
  values.length
    ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1))
    : 0;

async function getGuideReviews(
  guideId: number
): Promise<Either<string, CabinetReviewsSummary>> {
  const rows = await dbClient.review.findMany({
    where: { tour: { authorId: guideId } },
    include: {
      user: { select: { firstName: true, lastName: true, login: true } },
      tour: { select: { id: true, title: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const reviews = rows.map(row => ({
    id: row.id,
    content: row.content,
    estimateValue: row.estimateValue,
    estimation: isEstimation(row.estimation)
      ? { ...EMPTY_ESTIMATION, ...row.estimation }
      : EMPTY_ESTIMATION,
    createdAt: row.createdAt.toISOString(),
    authorName: buildDisplayName(row.user),
    tourId: row.tour.id,
    tourTitle: row.tour.title,
    tourSlug: row.tour.slug,
    guideReply: row.guideReply,
    guideReplyAt: row.guideReplyAt?.toISOString() ?? null
  }));

  return right({
    reviews,
    rating: average(reviews.map(review => review.estimateValue)),
    total: reviews.length,
    unanswered: reviews.filter(review => !review.guideReply).length,
    distribution: [5, 4, 3, 2, 1].map(score => ({
      score,
      count: reviews.filter(review => Math.round(review.estimateValue) === score)
        .length
    })),
    criteria: {
      guideWork: average(reviews.map(review => review.estimation.guideWork)),
      informationQuality: average(
        reviews.map(review => review.estimation.informationQuality)
      ),
      trailQuality: average(reviews.map(review => review.estimation.trailQuality))
    }
  });
}

/**
 * Ответ гида на отзыв.
 *
 * Отзыв нельзя ни удалить, ни исправить — можно только ответить, и ответ
 * виден всем на странице тура. Поэтому проверяем, что отзыв относится
 * к туру этого гида, а не просто существует.
 */
async function replyToReview(
  guideId: number,
  reviewId: number,
  reply: string
): Promise<Either<string, { id: number }>> {
  const review = await dbClient.review.findUnique({
    where: { id: reviewId },
    include: { tour: { select: { authorId: true } } }
  });

  if (!review) return left('Отзыв не найден');
  if (review.tour.authorId !== guideId) return left('Это отзыв не о вашем туре');

  await dbClient.review.update({
    where: { id: reviewId },
    data: {
      guideReply: reply.trim() || null,
      guideReplyAt: reply.trim() ? new Date() : null
    }
  });

  return right({ id: reviewId });
}

export const cabinetReviewsService = { getGuideReviews, replyToReview };
