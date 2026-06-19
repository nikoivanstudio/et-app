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
  getBookings,
  updateBooking,
  getBookingsQueryOption
};
