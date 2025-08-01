'use client';
import { RotateCw } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuTrash2, LuPen } from 'react-icons/lu';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export const SubmitButton = ({
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

export const CardSignInButton = () => {
  return (
    <SignInButton mode='modal'>
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer'
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  );
};

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer'
    >
      {pending ? (
        <RotateCw className='animate-spin' />
      ) : isFavorite ? (
        <FaHeart className='text-red-500' />
      ) : (
        <FaRegHeart className='text-gray-500' />
      )}
    </Button>
  );
};

type actionType = 'delete' | 'edit';
export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus();
  const renderIcon = () => {
    switch (actionType) {
      case 'delete':
        return <LuTrash2 />;
      case 'edit':
        return <LuPen />;
      default:
        const never: never = actionType;
        throw new Error(`Unknown action type: ${never}`);
    }
  };

  return (
    <Button
      type='submit'
      variant='link'
      size='icon'
      className='p-2 cursor-pointer'
    >
      {pending ? <RotateCw className='animate-spin' /> : renderIcon()}
    </Button>
  );
};
