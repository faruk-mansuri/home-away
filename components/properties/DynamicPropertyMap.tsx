'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';

const DynamicPropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className='h-[400px] w-full' />,
});

export default DynamicPropertyMap;
