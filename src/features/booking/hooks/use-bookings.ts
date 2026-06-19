import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { BookingDomain } from '@/entities/booking';

import { bookingApi } from '../api/booking-api';
import { UpdateBookingPayload } from '../model/schemas';

type GuideBookingsResponse = { bookings: BookingDomain.BookingListItem[] };
type AllBookingsResponse = { groups: BookingDomain.GuideBookingsGroup[] };

export const useGuideBookings = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    bookingApi.getBookingsQueryOption<GuideBookingsResponse>()
  );

  return { data, isLoading, isFetching, error };
};

export const useAllBookings = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    bookingApi.getBookingsQueryOption<AllBookingsResponse>('all')
  );

  return { data, isLoading, isFetching, error };
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, UpdateBookingPayload>({
    mutationFn: payload => bookingApi.updateBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [bookingApi.baseKey] });
      toast.success('Заявка обновлена');
    },
    onError: error => toast.error(error.message)
  });

  return { update: mutation.mutate, isPending: mutation.isPending };
};
