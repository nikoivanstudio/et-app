import { queryOptions } from '@tanstack/react-query';

import { GetUserResponse } from '@/features/user/domain';

import { apiClient } from '@/shared/api/api-client';
import { GetApiData } from '@/shared/model/types';

const baseUrl = 'dashboard/users';
const baseKey = 'users';

const getUsers = <T>({ signal, page, search }: GetApiData) =>
  apiClient.get<T>({
    url: baseUrl,
    signal,
    queryParams: { page: String(page), search }
  });

const deleteUser = (id: number) =>
  apiClient.del({
    url: baseUrl,
    queryParams: {
      id: String(id)
    }
  });

const getUserListQueryOption = ({
  page,
  search
}: {
  page: number;
  search: string;
}) =>
  queryOptions({
    queryKey: [baseKey, { page, search }],
    queryFn: ({ signal }) => getUsers<GetUserResponse>({ signal, page, search })
  });

export const userApi = {
  baseKey,
  getUsers,
  deleteUser,
  getUserListQueryOption
};
