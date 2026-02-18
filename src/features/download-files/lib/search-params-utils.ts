import { searchFileUtils } from '@/entities/file/server';
import { dbQueryUtils, PageParams } from '@/shared/lib/db-client-utils';
import { Prisma } from '../../../../generated/prisma/client';

const getParamsBySearchParams = (
  searchParams: URLSearchParams
): Prisma.FileFindManyArgs => {
  const pageParams: PageParams = dbQueryUtils.getPageParams(
    searchParams.get('page')
  );
  const whereConditions: Prisma.FileWhereInput[] = [];

  const searchCondition = searchFileUtils.getSearchParamsUtils(
    searchParams.get('search')
  );

  if (searchCondition) {
    whereConditions.push(searchCondition);
  }

  const authorCondition = searchFileUtils.getAuthorParams(
    searchParams.get('author')
  );

  if (authorCondition) {
    whereConditions.push(authorCondition);
  }

  const dateCondition = searchFileUtils.getDateParams(
    searchParams.get('start_date'),
    searchParams.get('end_date')
  );

  if (dateCondition) {
    whereConditions.push(dateCondition);
  }

  return {
    ...pageParams,
    ...(whereConditions.length ? { where: { AND: whereConditions } } : {})
  };
};

export const searchParamsUtils = { getParamsBySearchParams };
