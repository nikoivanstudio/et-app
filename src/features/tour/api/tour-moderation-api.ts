import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/api-client';

import { ReviewTourPayload } from '../lib/schemas/create-tour-schemas';

const baseUrl = 'dashboard/tours';
const baseKey = 'pending-tours';

const getPendingTours = <T>(signal?: AbortSignal) =>
  apiClient.get<T>({
    url: baseUrl,
    signal
  });

const reviewTour = <T>(payload: ReviewTourPayload) =>
  apiClient.patch<T>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

const getPendingToursQueryOption = <T>() =>
  queryOptions({
    queryKey: [baseKey],
    queryFn: ({ signal }) => getPendingTours<T>(signal)
  });

export const tourModerationApi = {
  baseKey,
  getPendingTours,
  reviewTour,
  getPendingToursQueryOption
};
