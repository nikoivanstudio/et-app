import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createActivitySchema } from '@/entities/activity/server';
import { FormDialogDomain } from '@/entities/form-dialog';

import { activityApi } from '../api/activity-api';

type Props = {
  onSuccess?: (data?: unknown) => void;
  onError?: (error: Error) => void;
};

export const useCreateActivity = (props?: Props) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: activityApi.createActivity,
    onSuccess: either => {
      if (either.type === 'left')
        throw new Error('Ошибка при создание нового тура');

      queryClient.invalidateQueries({ queryKey: [activityApi.baseKey] });

      props?.onSuccess && props.onSuccess();
    },
    onError: error => {
      props?.onError && props.onError(error);
    }
  });

  return async (data: FormDialogDomain.FormData) => {
    const dataEntity = createActivitySchema.safeParse(data);

    if (!dataEntity.success) {
      throw new Error('Ошибка валидации данных');
    }
    mutate(dataEntity.data);
  };
};
