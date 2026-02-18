import { Prisma } from '../../../../generated/prisma/client';

jest.mock('@/entities/file/server', () => ({
  searchFileUtils: jest.requireActual('@/entities/file/lib/search-file-utils')
    .searchFileUtils
}));

import { searchParamsUtils } from './search-params-utils';

const getAndConditions = (where: Prisma.FileWhereInput | undefined) => {
  if (!where?.AND) return [];

  return Array.isArray(where.AND) ? where.AND : [where.AND];
};

describe('downloadFiles searchParamsUtils', () => {
  it('returns default page params when query is empty', () => {
    const result = searchParamsUtils.getParamsBySearchParams(
      new URLSearchParams()
    );

    expect(result).toEqual({ take: 10 });
  });

  it('builds pagination for page=2', () => {
    const result = searchParamsUtils.getParamsBySearchParams(
      new URLSearchParams('page=2')
    );

    expect(result).toEqual({ take: 10, skip: 10 });
  });

  it('combines search, author and date range into where.AND', () => {
    const result = searchParamsUtils.getParamsBySearchParams(
      new URLSearchParams(
        'page=2&search=file&author=15&start_date=2026-01-10&end_date=2026-01-12'
      )
    );

    expect(result.take).toBe(10);
    expect(result.skip).toBe(10);
    expect(result.where).toBeDefined();

    const andConditions = getAndConditions(result.where);
    expect(andConditions).toHaveLength(3);
    expect(andConditions).toEqual(
      expect.arrayContaining([
        { originalName: { contains: 'file', mode: 'insensitive' } },
        { authorId: 15 }
      ])
    );

    const dateCondition = andConditions.find((item) => 'createdAt' in item) as
      | { createdAt: { gte?: Date; lt?: Date } }
      | undefined;

    expect(dateCondition).toBeDefined();
    expect(dateCondition?.createdAt.gte).toBeInstanceOf(Date);
    expect(dateCondition?.createdAt.lt).toBeInstanceOf(Date);
  });

  it('adds only valid filters to where.AND', () => {
    const result = searchParamsUtils.getParamsBySearchParams(
      new URLSearchParams('author=abc&search=doc&start_date=bad-date')
    );

    const andConditions = getAndConditions(result.where);
    expect(andConditions).toEqual([
      { originalName: { contains: 'doc', mode: 'insensitive' } }
    ]);
  });
});
