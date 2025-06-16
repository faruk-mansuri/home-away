import Link from 'next/link';
import { Button } from '../ui/button';
import { Tent } from 'lucide-react';

const Logo = () => {
  return (
    <Button asChild size='icon'>
      <Link href={'/'}>
        <Tent className='h-6 w-6' />
      </Link>
    </Button>
  );
};

export default Logo;
