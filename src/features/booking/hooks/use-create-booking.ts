import { useMutation } from '@tanstack/react-query';

import { bookingApi } from '../api/booking-api';
import { CreateBookingPayload } from '../model/schemas';

export type CreateBookingResult = {
  accessToken: string;
  guideName: string;
};

type HookProps = {
  onSuccess?: (result: CreateBookingResult) => void;
};

export const useCreateBooking = ({ onSuccess }: HookProps = {}) => {
  const mutation = useMutation<CreateBookingResult, Error, CreateBookingPayload>({
    mutationFn: payload =>
      bookingApi.createBooking<CreateBookingResult>(payload),
    onSuccess
  });

  return {
    createBooking: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error
  };
};
