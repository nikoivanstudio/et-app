import { isEstimation } from '@/entities/review/lib/typeguards';

import { Review } from '../../../generated/prisma/client';

export type Estimation = {
  guideWork: number;
  informationQuality: number;
  trailQuality: number;
};

export type ReviewEntity = {
  id: number;
  content: string;
  estimation: Estimation;
  estimateValue: number;
  authorId: number;
  tourId: number;
};

export function reviewToReviewEntity(review: Review): ReviewEntity {
  const { estimation, ...rest } = review;

  if (!isEstimation(estimation)) {
    throw new Error(
      `Review id: ${review.id} is invalid because estimation is now valid JSON Estimation`
    );
  }

  return { ...rest, estimation };
}
