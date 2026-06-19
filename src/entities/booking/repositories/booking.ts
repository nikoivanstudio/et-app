import { dbClient } from '@/shared/lib/db';

import { Booking, Prisma } from '../../../../generated/prisma/client';

const createBooking = (
  data: Prisma.BookingUncheckedCreateInput
): Promise<Booking> => dbClient.booking.create({ data });

const getBookings = <T extends Prisma.BookingFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.BookingFindManyArgs>
): Promise<Prisma.BookingGetPayload<T>[]> =>
  dbClient.booking.findMany(args) as Promise<Prisma.BookingGetPayload<T>[]>;

const getBookingById = (id: number): Promise<Booking | null> =>
  dbClient.booking.findUnique({ where: { id } });

const getBookingByToken = <T extends Prisma.BookingInclude>(
  accessToken: string,
  include?: T
): Promise<Prisma.BookingGetPayload<{ include: T }> | null> =>
  dbClient.booking.findUnique({
    where: { accessToken },
    include
  }) as Promise<Prisma.BookingGetPayload<{ include: T }> | null>;

const updateBooking = (
  id: number,
  data: Prisma.BookingUpdateInput
): Promise<Booking> => dbClient.booking.update({ where: { id }, data });

const countBookings = (where?: Prisma.BookingWhereInput): Promise<number> =>
  dbClient.booking.count({ where });

export const bookingRepository = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingByToken,
  updateBooking,
  countBookings
};
