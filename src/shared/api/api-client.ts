import { urlUtils } from '@/shared/lib/url-utils';

type RequestParams = {
  url: string;
  queryParams?: Record<string, string | number>;
  withoutParse?: boolean;
  clearUrl?: boolean;
} & RequestInit;

const request = async <T>({
  url,
  body,
  method,
  signal,
  headers,
  queryParams,
  withoutParse,
  clearUrl
}: RequestParams): Promise<T> => {
  const response = await fetch(
    clearUrl ? url : `${urlUtils.getUrl(url, queryParams)}`,
    {
      method,
      body,
      signal,
      headers: {
        // CRIT-3: заголовок X-API-KEY убран. Он брался из NEXT_PUBLIC_X_API_KEY,
        // то есть встраивался в клиентский бандл и был доступен любому,
        // не создавая никакого барьера. Доступ подтверждается cookie сессии
        // и проверкой Origin на сервере.
        ...headers
      }
    }
  );

  if (withoutParse) {
    return response as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === 'string' ? data : 'Ошибка обработки запроса.'
    );
  }

  return data;
};

const get = <T>(params: RequestParams): Promise<T> =>
  request<T>({ ...params, method: 'GET', body: undefined });

const post = <T>(params: RequestParams) =>
  request<T>({ ...params, method: 'POST' });

const put = <T>(params: RequestParams) =>
  request<T>({ ...params, method: 'PUT' });

const patch = <T>(params: RequestParams) =>
  request<T>({ ...params, method: 'PATCH' });

const del = <T>(params: RequestParams) =>
  request<T>({ ...params, method: 'DELETE' });

export const apiClient = { get, post, put, patch, del };
