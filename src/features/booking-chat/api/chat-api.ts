import { queryOptions } from '@tanstack/react-query';

import { MessageDomain } from '@/entities/message';

import { apiClient } from '@/shared/api/api-client';

import { SendMessagePayload } from '../model/schemas';

const baseUrl = 'bookings/messages';
const baseKey = 'booking-chat';

export type ThreadTarget = { token?: string; bookingId?: number };

const getThread = (target: ThreadTarget, signal?: AbortSignal) =>
  apiClient.get<MessageDomain.ChatThread>({
    url: baseUrl,
    queryParams: target.token
      ? { token: target.token }
      : { bookingId: target.bookingId ?? 0 },
    signal
  });

const sendMessage = (payload: SendMessagePayload) =>
  apiClient.post<MessageDomain.ChatMessage>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

const getThreadQueryOption = (target: ThreadTarget, enabled = true) =>
  queryOptions({
    queryKey: [baseKey, target.token ?? target.bookingId],
    queryFn: ({ signal }) => getThread(target, signal),
    enabled,
    // Сокетов в проекте нет: переписка подтягивается опросом. Пятнадцать
    // секунд — компромисс между «ответ виден сразу» и лимитом запросов.
    refetchInterval: 15_000
  });

export const chatApi = {
  baseKey,
  getThread,
  sendMessage,
  getThreadQueryOption
};
