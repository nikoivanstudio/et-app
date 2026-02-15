import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/features/post/api/post-api';

import { FormDialogDomain } from '@/entities/form-dialog';
import { PostCreate } from '@/entities/post';
import { postCreateSchema } from '@/entities/post/model/schemas';

type HookConfig<E> = {
  onSuccess?: (value?: unknown) => (Promise<unknown> | unknown) | undefined;
  onError?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onSettled?: (value?: unknown) => void | Promise<void>;
};

export const useCreatePost = <E>(config?: HookConfig<E>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<string, E, PostCreate>({
    mutationFn: data => postApi.createPost(data),
    onSuccess: message => {
      queryClient.invalidateQueries({ queryKey: [postApi.baseKey] });

      if (!config?.onSuccess) return;

      config.onSuccess(message);
    },
    onSettled: message => {
      !!config?.onSettled && config.onSettled(message);
    },
    onError: error => {
      !!config?.onError && config.onError(error);
    }
  });

  return async (data: FormDialogDomain.FormData) => {
    const result = postCreateSchema.safeParse(data);

    if (!result.success) {
      throw new Error('Ошибка при создание поста');
    }

    mutation.mutate(result.data);
  };
};
