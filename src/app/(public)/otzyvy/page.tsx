'use server';

import { FC } from 'react';

import { reviewsService, ReviewsView } from '@/views/reviews/server';

const ReviewsPage: FC = async () => {
  const { items, summary } = await reviewsService.getSiteReviews();

  return <ReviewsView items={items} summary={summary} />;
};

export default ReviewsPage;
