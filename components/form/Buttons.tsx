'use client';

'use client';
import { RotateCw } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type SubmitButtonProps = {
  className?: string;
  text?: string;
};

const Buttons = ({ className = '', text = 'submit' }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type='submit'
      className={`capitalize cursor-pointer ${className}`}
      size='lg'
    >
      {pending ? (
        <>
          <RotateCw className='mr-2 h-4 w-4 animate-spin' />
          Please wait ...
        </>
      ) : (
        text
      )}
    </Button>
  );
};

export default Buttons;
