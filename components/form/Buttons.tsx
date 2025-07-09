'use client';

'use client';
import { RotateCw } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

const SubmitButton = ({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type='submit'
      className={`capitalize cursor-pointer ${className}`}
      size={size}
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

export default SubmitButton;
