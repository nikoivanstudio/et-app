import { Either, left, right } from '@/shared/lib/either';
import { isStringArray } from '@/shared/lib/typeguargs/string-array';
import { apiClient } from '@/shared/api/api-client';
import { queryOptions } from '@tanstack/react-query';

import { GetToursResponse } from '@/features/tour/domain';
import { GetApiData } from '@/shared/model/types';
import { Tour } from '../../../../generated/prisma/client';

const createErrorMessage = 'Ошибка создания тура';
const updateErrorMessage = 'Ошибка редактирования тура';
const deleteErrorMessage = 'Ошибка при удаление тура';

const baseKey = 'tours';
const baseUrl = 'tour';

const getTours = <T>({ signal, page, search }: GetApiData) =>
  apiClient.get<T>({
    url: `${baseKey}/user`,
    signal,
    queryParams: { page: String(page), search }
  });

export const createTour = async (
  formData: FormData
): Promise<Either<string, string>> => {
  try {
    const response = await apiClient.post<Response>({
      url: baseUrl,
      body: formData,
      withoutParse: true
    });

    if (response.status >= 300) {
      const errors = await response.json();

      const error =
        !!errors &&
        (typeof errors === 'string'
          ? errors
          : isStringArray(errors)
            ? errors.join(', ')
            : createErrorMessage);

      return left(error || createErrorMessage);
    }

    return right(await response.json());
  } catch {
    return left(createErrorMessage);
  }
};

const editTour = async (formData: FormData): Promise<Either<string, Tour>> => {
  const result = await apiClient.patch<Tour>({
    url: baseUrl,
    body: formData
  });

  if (!result) {
    return left(updateErrorMessage);
  }

  return right(result);
};

const deleteTour = async (id: number): Promise<Either<string, Tour>> => {
  try {
    const response = await apiClient.del<Response>({
      url: baseUrl,
      queryParams: { id }
    });

    if (response.status >= 300) {
      return left(deleteErrorMessage);
    }

    return right(await response.json());
  } catch (e) {
    console.warn(e);

    return left(deleteErrorMessage);
  }
};

const getTourListQueryOption = ({
  page,
  search
}: {
  page: number;
  search: string;
}) =>
  queryOptions({
    queryKey: [baseKey, { page, search }],
    queryFn: ({ signal }) =>
      getTours<GetToursResponse>({ signal, page, search })
  });

export const tourApi = {
  baseKey,
  createTour,
  editTour,
  deleteTour,
  getTourListQueryOption
};
