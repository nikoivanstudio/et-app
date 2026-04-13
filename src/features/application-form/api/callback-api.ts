import {
  ApplicationData,
  CallbackData
} from '@/features/application-form/domain';

import { Either, left, right } from '@/shared/lib/either';
import { urlUtils } from '@/shared/lib/url-utils';

export const sendCallbackRequest = async (
  data: CallbackData,
  appData?: ApplicationData
): Promise<Either<string, string>> => {
  const url = `${urlUtils.getApiUrl()}/callback`;
  const body = !!appData ? { ...data, ...appData } : { ...data };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (response.status >= 300) {
      throw new Error(response.statusText);
    }

    const result = (await response.json()) as string;

    return right(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : 'Ошибка при отправке заявки на обратный звонок';

    return left(errorMessage);
  }
};
