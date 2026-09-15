'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';

import { BookingDomain } from '@/entities/booking';
import {
  getLocalBookingsSnapshot,
  getServerLocalBookingsSnapshot,
  parseBookingTokens,
  subscribeLocalBookings
} from '@/entities/booking/lib/local-bookings';

import { bookingApi } from '../api/booking-api';

type Response = { bookings: BookingDomain.BookingListItem[] };

/**
 * Токены заявок этого браузера.
 *
 * Через `useSyncExternalStore`, а не чтением в эффекте: localStorage —
 * внешнее хранилище, на сервере его нет, и список должен обновиться,
 * если заявку оставили в соседней вкладке.
 */
export const useLocalBookingTokens = (): string[] => {
  const raw = useSyncExternalStore(
    subscribeLocalBookings,
    getLocalBookingsSnapshot,
    getServerLocalBookingsSnapshot
  );

  return useMemo(() => parseBookingTokens(raw), [raw]);
};

/** Заявки этого устройства с актуальными статусами и непрочитанным. */
export const useLocalBookings = () => {
  const tokens = useLocalBookingTokens();

  const { data, isLoading, error } = useQuery(
    bookingApi.getBookingsByTokensQueryOption<Response>(tokens)
  );

  return {
    hasTokens: tokens.length > 0,
    bookings: data?.bookings ?? [],
    isLoading: tokens.length > 0 && isLoading,
    error
  };
};
