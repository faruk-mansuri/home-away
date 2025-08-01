import { calculateTotals } from '@/utils/calculateTotals';
import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProperty } from '@/utils/store';
import { formatCurrency } from '@/utils/format';

const BookingForm = () => {
  const { range, price } = useProperty((state) => state);
  const checkIn = range?.to as Date;
  const checkOut = range?.from as Date;
  const { totalNights, subTotal, cleaningFee, serviceFee, tax, orderTotal } =
    calculateTotals({
      checkIn,
      checkOut,
      price,
    });

  return (
    <Card className='p-8 mb-4 gap-2'>
      <CardTitle className='mb-8'>Summary</CardTitle>
      <FormRow label={`$${price} x ${totalNights} nights`} amount={subTotal} />
      <FormRow label='Cleaning Fee' amount={cleaningFee} />
      <FormRow label='Service Fee' amount={serviceFee} />
      <FormRow label='Tax' amount={tax} />
      <Separator className='mt-4' />
      <CardTitle className='mt-4'>
        <FormRow label='Booking Total' amount={orderTotal} />
      </CardTitle>
    </Card>
  );
};

function FormRow({ label, amount }: { label: string; amount: number }) {
  return (
    <p className='flex justify-between text-sm mb-2'>
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </p>
  );
}
export default BookingForm;
