'use client';

import { Skeleton } from '@/components/ui/skeleton';

const PropertiesLoading = () => {
  return (
    <section className='flex flex-col gap-4'>
      <Skeleton className='h-4 w-2/5 rounded' />
      <Skeleton className='h-5 w-3/5 rounded' />
      <Skeleton className='h-[300px] md:h-[500px] w-full rounded' />;
    </section>
  );
};

export default PropertiesLoading;
