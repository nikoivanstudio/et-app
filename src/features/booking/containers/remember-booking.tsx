'use client';

import { FC, useEffect } from 'react';

import { rememberBookingToken } from '@/entities/booking/lib/local-bookings';

type Props = { token: string };

/**
 * Запоминает открытую заявку на этом устройстве.
 *
 * Нужен для перехода по ссылке из письма: человек оставил заявку с телефона,
 * а открыл на ноутбуке — без этого заявка не попала бы в его «Мои заявки»
 * и на новом устройстве, и ссылку пришлось бы хранить снова.
 */
export const RememberBooking: FC<Props> = ({ token }) => {
  useEffect(() => {
    rememberBookingToken(token);
  }, [token]);

  return null;
};
