import LoadingTable from '@/components/booking/LoadingTable';
import { Skeleton } from '@/components/ui/skeleton';

const ReservationsLoadingPage = () => {
  return (
    <section className='mt-16'>
      <Skeleton className='mb-4 h-6 w-1/3' />
      <LoadingTable />
    </section>
  );
};

export default ReservationsLoadingPage;
