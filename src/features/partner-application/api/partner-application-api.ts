import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/api-client';

import { ReviewApplicationPayload } from '../model/schemas';

const baseUrl = 'dashboard/applications';
const baseKey = 'partner-applications';

const getApplications = <T>(signal?: AbortSignal) =>
  apiClient.get<T>({
    url: baseUrl,
    signal
  });

const reviewApplication = <T>(payload: ReviewApplicationPayload) =>
  apiClient.patch<T>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

const getApplicationsQueryOption = <T>() =>
  queryOptions({
    queryKey: [baseKey],
    queryFn: ({ signal }) => getApplications<T>(signal)
  });

export const partnerApplicationApi = {
  baseKey,
  getApplications,
  reviewApplication,
  getApplicationsQueryOption
};
