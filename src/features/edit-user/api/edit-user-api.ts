import { UserEditPayload } from '@/features/edit-user/model/types';

import { apiClient } from '@/shared/api/api-client';

const baseUrl = 'dashboard/users';
const baseKey = 'users';

const editUser = <T>(user: UserEditPayload) =>
  apiClient.patch<T>({
    url: baseUrl,
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const editUserApi = {
  baseKey,
  editUser
};
