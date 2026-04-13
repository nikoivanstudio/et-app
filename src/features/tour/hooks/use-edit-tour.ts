import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tour } from 'generated/prisma/client';

import { tourApi } from '@/features/tour/api/tour-api';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';

import { FormDialogDomain } from '@/entities/form-dialog';

import { Either } from '@/shared/lib/either';

type Props = {
  id?: number;
  authorId?: number;
  onSuccess?: (data?: unknown) => void;
  onError?: (error: Error) => void;
};

export const useEditTour = (props: Props) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<Either<string, Tour>, Error, FormData>({
    mutationFn: tourApi.editTour,
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
      prepareDataUtils.prepareDataToCreate({
        ...data,
        id: props.id,
        authorId: props.authorId
      });

    const formData = new FormData();

    dataForCreate.forEach(([key, value]) => formData.append(key, value));

    mutate(formData);
  };
};
