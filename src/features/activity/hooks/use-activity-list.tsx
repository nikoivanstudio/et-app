import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

import { cn } from '@/shared/lib/css';
import { SearchInput } from '@/shared/ui/search-input';
import { SimplePagination } from '@/shared/ui/simple-pagination';
import { Spinner } from '@/shared/ui/spinner';

import { activityApi } from '../api/activity-api';
import { GetActivityResponse } from '../domain';

type ActivityListData = {
  data: NoInfer<GetActivityResponse> | undefined;
  isFetching: boolean;
  tools: ReactNode;
  pagination: ReactNode;
  cursor: ReactNode;
};

export const useActivityList = (): ActivityListData => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const { isLoading, data, error, isFetching } = useQuery({
    ...activityApi.getActivityListQueryOptions({ page, search })
  });

  const onNext = () =>
    setPage(prev => Math.min(prev + 1, data?.pagesCount || 1));
  const onPrev = () => setPage(prev => Math.max(prev - 1, 1));

  const onSearch = (value: string) => setSearch(value);

  const tools = (
    <>
      <SearchInput searchValue={search} onSearch={onSearch} />
      {isLoading && (
        <div className='flex justify-center items-center w-full h-full min-h-96'>
          <Spinner />
        </div>
      )}
    </>
  );

  const pagination =
    !!data?.pagesCount && data.pagesCount > 1 ? (
      <SimplePagination
        currentCount={page}
        totalCount={data?.pagesCount}
        onPrevClick={onPrev}
        onNextClick={onNext}
      />
    ) : null;

  const cursor = !!error ? (
    <div className={cn('Error', 'text-red-600', 'h-6')}>{error.message}</div>
  ) : null;

  return { data, isFetching, tools, pagination, cursor };
};
