'use client';

import { useProperty } from '@/utils/store';
import BookingCalendar from './BookingCalender';
import BookingContainer from './BookingContainer';
import { useEffect } from 'react';

import type { Booking } from '@/utils/types';

type BookingWrapperProps = {
  propertyId: string;
  price: number;
  bookings: Booking[];
};
const BookingWrapper = ({
  propertyId,
  price,
  bookings,
}: BookingWrapperProps) => {
  useEffect(() => {
    useProperty.setState({
      propertyId,
      price,
      bookings,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BookingCalendar />
      <BookingContainer />
    </>
  );
};

export default BookingWrapper;
