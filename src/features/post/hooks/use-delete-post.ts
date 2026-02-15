import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/features/post/api/post-api';

type HookConfig<E> = {
  id: number;
  onSuccess?: (value?: unknown) => (Promise<unknown> | unknown) | undefined;
  onError?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onSettled?: (value?: unknown) => void | Promise<void>;
};

export const useDeletePost = <E>({
  id,
  onSuccess,
  onSettled,
  onError
}: HookConfig<E>): (() => Promise<void>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, E, number>({
    mutationFn: postApi.deletePost,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [postApi.baseKey] });

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
