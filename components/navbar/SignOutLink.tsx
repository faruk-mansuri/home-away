'use client';

import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';

const SignOutLink = () => {
  const handleLogout = async () => {
    toast('You have been signed out.');
  };
  return (
    <SignOutButton redirectUrl='/'>
      <button
        className='w-full text-left cursor-pointer'
        onClick={handleLogout}
      >
        Logout
      </button>
    </SignOutButton>
  );
};

export default SignOutLink;
