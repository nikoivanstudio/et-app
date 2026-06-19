'use server';

import { FC } from 'react';

import { BookingView } from '@/views/booking/server';

type Props = {
  params: Promise<{ token: string }>;
};

const BookingPage: FC<Props> = async props => <BookingView {...props} />;

export default BookingPage;
