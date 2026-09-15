import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/api-client';

import { CreateBookingPayload, UpdateBookingPayload } from '../model/schemas';

const baseUrl = 'bookings';
const baseKey = 'bookings';

const createBooking = <T>(payload: CreateBookingPayload) =>
  apiClient.post<T>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

const getBookings = <T>(scope?: 'all', signal?: AbortSignal) =>
  apiClient.get<T>({
    url: baseUrl,
    queryParams: scope ? { scope } : undefined,
    signal
  });

const updateBooking = <T>(payload: UpdateBookingPayload) =>
  apiClient.patch<T>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

/** Заявки этого устройства: токены из localStorage → актуальные статусы. */
const getBookingsByTokens = <T>(tokens: string[], signal?: AbortSignal) =>
  apiClient.get<T>({
    url: `${baseUrl}/tokens`,
    queryParams: { tokens: tokens.join(',') },
    signal
  });

const getBookingsByTokensQueryOption = <T>(tokens: string[]) =>
  queryOptions({
    queryKey: [baseKey, 'by-tokens', tokens.join(',')],
    queryFn: ({ signal }) => getBookingsByTokens<T>(tokens, signal),
    enabled: tokens.length > 0
  });

const getBookingsQueryOption = <T>(scope?: 'all') =>
  queryOptions({
    queryKey: [baseKey, scope ?? 'mine'],
    queryFn: ({ signal }) => getBookings<T>(scope, signal),
    // Виджет подтягивает новые заявки сам.
    refetchInterval: 30_000
  });

export const bookingApi = {
  baseKey,
  createBooking,
  getBookingsByTokens,
  getBookingsByTokensQueryOption,
  getBookings,
  updateBooking,
  getBookingsQueryOption
};
