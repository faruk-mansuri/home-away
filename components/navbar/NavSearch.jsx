'use client';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

const NavSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const debouncedSearch = useDebouncedCallback((value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearchTerm('');
    }
  }, [searchParams.get('search')]);

  return (
    <Input
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
      }}
      type='text'
      placeholder='find a property...'
      className='max-w-xs dark:bg-muted'
    />
  );
};

export default NavSearch;
