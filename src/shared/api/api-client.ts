import { urlUtils } from '@/shared/lib/url-utils';

type RequestParams = {
  url: string;
  queryParams?: Record<string, string | number>;
  withoutParse?: boolean;
} & RequestInit;

const request = async <T>({
  url,
  body,
  method,
  signal,
  headers,
  queryParams,
  withoutParse
}: RequestParams): Promise<T> => {
  const response = await fetch(`${urlUtils.getUrl(url, queryParams)}`, {
    method,
    body,
    signal,
    headers: {
      'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY || '',
      ...headers
    }
  });

  return withoutParse ? (response as T) : await response.json();
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
