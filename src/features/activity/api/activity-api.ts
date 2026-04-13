import { queryOptions } from '@tanstack/react-query';
import { Activity } from 'generated/prisma/client';

import { ActivityDomain } from '@/entities/activity/server';

import { apiClient } from '@/shared/api/api-client';
import { Either, left, right } from '@/shared/lib/either';
import { GetApiData } from '@/shared/model/types';

import { GetActivityResponse } from '../domain';

const createErrorMessage = 'Ошибка создания мероприятия';
const deleteErrorMessage = 'Ошибка удаления мероприятия';

const baseKey = 'activities';
const baseUrl = 'activity';

const getOwnActivities = <T>({ signal, page, search }: GetApiData) =>
  apiClient.get<T>({
    url: `${baseUrl}/user`,
    signal,
    queryParams: { page: String(page), search }
  });

export const createActivity = async (
  data: ActivityDomain.CreateActivityData
): Promise<Either<string, ActivityDomain.ActivityEntity>> => {
  try {
    const response = await apiClient.post<ActivityDomain.ActivityEntity>({
      url: baseUrl,
      body: JSON.stringify(data)
    });

    if (!response) {
      return left(createErrorMessage);
    }

    return right(response);
  } catch {
    return left(createErrorMessage);
  }
};

export const deleteActivity = async (
  id: number
): Promise<Either<string, Activity>> => {
  try {
    const response = await apiClient.del<Activity>({
      url: baseUrl,
      queryParams: { id }
    });

    return right(response);
  } catch (e) {
    console.warn(e);

    return left(deleteErrorMessage);
  }
};

const getActivityListQueryOptions = ({
  page,
  search
}: {
  page: number;
  search: string;
}) =>
  queryOptions({
    queryKey: [baseKey, { page, search }],
    queryFn: ({ signal }) =>
      getOwnActivities<GetActivityResponse>({ signal, page, search })
  });

export const activityApi = {
  baseKey,
  createActivity,
  deleteActivity,
  getActivityListQueryOptions
};
