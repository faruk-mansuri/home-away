'use client';
import { Card, CardHeader } from '@/components/ui/card';
import { LuMinus, LuPlus } from 'react-icons/lu';

import { Button } from '../ui/button';
import { useState } from 'react';

const CounterInput = ({
  detail,
  defaultValue,
}: {
  detail: string;
  defaultValue?: number;
}) => {
  const [count, setCount] = useState(defaultValue || 0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <Card className='mb-4'>
      <input type='hidden' name={detail} value={count} />
      <CardHeader>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col'>
            <h2 className='font-medium capitalize'>{detail}</h2>
            <p className='text-muted-foreground text-sm'>
              Specify the number of {detail}
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Button
              className='cursor-pointer'
              variant='outline'
              size='icon'
              type='button'
              onClick={handleDecrement}
            >
              <LuMinus className='w-5 h-5 text-primary' />
            </Button>
            <span className='text-xl font-bold w-5 text-center'>{count}</span>
            <Button
              className='cursor-pointer'
              variant='outline'
              size='icon'
              type='button'
              onClick={handleIncrement}
            >
              <LuPlus className='w-5 h-5 text-primary' />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
  return (
    <Card className=' mb-4'>
      {/* input */}

      <CardHeader className='flex flex-col gap-y-5'>
        <div className='flex items-center justify-between flex-wrap border-4'>
          <div className='flex flex-col'>
            <h2 className='font-medium capitalize'>{detail}</h2>
            <p className='text-muted-foreground text-sm'>
              Specify number of {detail}
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='icon'
              type='button'
              onClick={handleDecrement}
            >
              <LuMinus className='h-5 w-5 text-primary' />
            </Button>
            <span className='text-xl font-bold w-5 text-center'>{count}</span>
            <Button
              variant='outline'
              size='icon'
              type='button'
              onClick={handleIncrement}
            >
              <LuPlus className='h-5 w-5 text-primary' />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CounterInput;
