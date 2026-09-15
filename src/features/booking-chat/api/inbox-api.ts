import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/api-client';

import type { InboxThreadItem } from '../services/inbox-service';

const baseUrl = 'bookings/inbox';
const baseKey = 'booking-inbox';

const getInbox = (signal?: AbortSignal) =>
  apiClient.get<{ threads: InboxThreadItem[] }>({ url: baseUrl, signal });

const getInboxQueryOption = () =>
  queryOptions({
    queryKey: [baseKey],
    queryFn: ({ signal }) => getInbox(signal),
    // Как и сама переписка: сокетов нет, новые сообщения подтягиваются опросом.
    refetchInterval: 20_000
  });

export const inboxApi = { baseKey, getInbox, getInboxQueryOption };
