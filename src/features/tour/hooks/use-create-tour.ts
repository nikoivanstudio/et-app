import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tourApi } from '@/features/tour/api/tour-api';
import { DEFAULT_STATUS } from '@/features/tour/constants/default-create-data';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';

import { FormDialogDomain } from '@/entities/form-dialog';

type Props = {
  onSuccess?: (data?: unknown) => void;
  onError?: (error: Error) => void;
};

export const useCreateTour = (props?: Props) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: tourApi.createTour,
    onSuccess: either => {
      if (either.type === 'left')
        throw new Error('Ошибка при создание нового тура');

      queryClient.invalidateQueries({ queryKey: [tourApi.baseKey] });

      props?.onSuccess && props.onSuccess();
    },
    onError: error => {
      props?.onError && props.onError(error);
    }
  });

  return async (data: FormDialogDomain.FormData) => {
    const dataForCreate: [string, string | File][] =
      prepareDataUtils.prepareDataToCreate({ ...data, status: DEFAULT_STATUS });

    const formData = new FormData();

    dataForCreate.forEach(([key, value]) => formData.append(key, value));

    mutate(formData);
  };
};
