import { activitySearchUtils } from '@/features/activity/lib/activity-search-utils';

import { dbQueryUtils, PageParams } from '@/shared/lib/db-client-utils';

import { Prisma } from '../../../../generated/prisma/client';

type ParamsFns = {
  page: (value: string | null) => PageParams;
  search: (
    value: string | null
  ) => { where: Prisma.ActivityWhereInput } | undefined;
};

const paramsFns: ParamsFns = {
  page: dbQueryUtils.getPageParams,
  search: activitySearchUtils.getSearchParamsUtils
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
): Prisma.ActivityFindManyArgs & {
  select?: never;
  include: { author: true };
} => {
  const keys = [...searchParams.keys()];

  const paramsArr = keys.reduce(
    (acc, key) => ({ ...acc, ...getParamsByKey(key, searchParams) }),
    {}
  );

  return { ...paramsArr, include: { author: true } };
};

export const activitySearchParams = { getParamsBySearchParams };
