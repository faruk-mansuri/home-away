import { calculateDaysBetween } from './calendar';

type BookingTotals = {
  checkIn: Date;
  checkOut: Date;
  price: number;
};

export const calculateTotals = ({
  checkIn,
  checkOut,
  price,
}: BookingTotals) => {
  const totalNights = calculateDaysBetween({ checkIn, checkOut });
  const subTotal = totalNights * price;
  const cleaningFee = 21; // Example fixed cleaning fee
  const serviceFee = subTotal * 0.1; // Example service fee of 10%
  const tax = subTotal * 0.05; // Example tax of 5%
  const orderTotal = subTotal + cleaningFee + serviceFee + tax;

  return {
    totalNights,
    subTotal,
    cleaningFee,
    serviceFee,
    tax,
    orderTotal,
  };
};
