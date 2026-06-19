import { getBookings, patchBooking, postBooking } from '@/features/booking/server';

export const POST = postBooking;
export const GET = getBookings;
export const PATCH = patchBooking;
