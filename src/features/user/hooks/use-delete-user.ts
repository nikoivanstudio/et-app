import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userApi } from '@/features/user/api/user-api';

type HookConfig<E> = {
  id: number;
  onSuccess?: (value?: unknown) => (Promise<unknown> | unknown) | undefined;
  onError?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onSettled?: (value?: unknown) => void | Promise<void>;
};

export const useDeleteUser = <E>({
  id,
  onSuccess,
  onSettled,
  onError
}: HookConfig<E>): (() => Promise<void>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, E, number>({
    mutationFn: userApi.deleteUser,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [userApi.baseKey] });

      if (!onSuccess) return;

      onSuccess(data);
    },

    onError: error => {
      !!onError && onError(error);
    },
    onSettled: data => {
      !!onSettled && onSettled(data);
    }
  });

  return async () => {
    mutation.mutate(id);
  };
};
