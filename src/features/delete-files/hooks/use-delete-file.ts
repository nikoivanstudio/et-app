import { useMutation, useQueryClient } from '@tanstack/react-query';

import { downloadFilesApi } from '@/features/download-files/api/download-files-api';

import { deleteFilesApi } from '../api/delete-files-api';

type HookConfig<E> = {
  id: number;
  onSuccess?: (value?: unknown) => (Promise<unknown> | unknown) | undefined;
  onError?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onSettled?: (value?: unknown) => void | Promise<void>;
};

export const useDeleteFile = <E>({
  id,
  onSuccess,
  onSettled,
  onError
}: HookConfig<E>): (() => Promise<void>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown, E, number>({
    mutationFn: deleteFilesApi.deleteFile,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [downloadFilesApi.filesBaseKey] });
      queryClient.invalidateQueries({ queryKey: [downloadFilesApi.authorsBaseKey] });

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
