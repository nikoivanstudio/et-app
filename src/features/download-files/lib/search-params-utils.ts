import { FileFindManyArgs } from './../../../../generated/prisma/models/File';
import { searchFileUtils } from '@/entities/file/server';
import { dbQueryUtils, PageParams } from '@/shared/lib/db-client-utils';
import { Prisma } from '../../../../generated/prisma/client';

type ParamsFns = {
  page: (value: string | null) => PageParams;
  search: (
    value: string | null
  ) => { where: Prisma.FileWhereInput } | undefined;
  author: (
    value: string | null
  ) => { where: Prisma.FileWhereInput } | undefined;
  //TODO: Добавить параметры по датам
};

const paramsFns: ParamsFns = {
  page: dbQueryUtils.getPageParams,
  search: searchFileUtils.getSearchParamsUtils,
  author: searchFileUtils.getAuthorParams
};

const isKeyOfParamsFns = (value: unknown): value is keyof ParamsFns =>
  !!value && typeof value === 'string' && value in paramsFns;

const getParamsByKey = (key: string, searchParams: URLSearchParams) => {
  if (!isKeyOfParamsFns(key)) return;

  const searchValue = searchParams.get(key);

  return paramsFns[key](searchValue);
};

const getParamsBySearchParams = (
  searchParams: URLSearchParams
): Prisma.FileFindManyArgs => {
  const keys = [...searchParams.keys()];

  const paramsArr = keys.reduce(
    (acc, key) => ({ ...acc, ...getParamsByKey(key, searchParams) }),
    {}
  );

  return { ...paramsArr };
};

export const searchParamsUtils = { getParamsBySearchParams };
