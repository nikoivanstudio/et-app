import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { bookingApi } from '@/features/booking/api/booking-api';

import { inboxApi } from '../api/inbox-api';

export const useGuideInbox = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    inboxApi.getInboxQueryOption()
  );

  return { threads: data?.threads ?? [], isLoading, isFetching, error };
};

/**
 * Открытая переписка помечается прочитанной на сервере, поэтому после
 * загрузки ленты счётчики в списке и в меню нужно пересчитать.
 */
export const useRefreshCounters = () => {
  const queryClient = useQueryClient();

  // Саму переписку не трогаем: её перезапрос снова пометил бы сообщения
  // прочитанными и вернул бы нас сюда же.
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [inboxApi.baseKey] });
    queryClient.invalidateQueries({ queryKey: [bookingApi.baseKey] });
  }, [queryClient]);
};
