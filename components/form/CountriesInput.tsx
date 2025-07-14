// import { Label } from '@/components/ui/label';
// import { formattedCountries } from '@/utils/countries';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import React from 'react';

// const name = 'country';
// const CountriesInput = ({ defaultValue }: { defaultValue?: string }) => {
//   return (
//     <div className='mb-2 space-y-1'>
//       <Label htmlFor={name} className='capitalize'>
//         {name}
//       </Label>

//       <Select
//         defaultValue={defaultValue || formattedCountries[0].code}
//         name={name}
//         required
//       >
//         <SelectTrigger id={name} className='w-full'>
//           <SelectValue />
//         </SelectTrigger>

//         <SelectContent>
//           {formattedCountries.map((country) => {
//             return (
//               <SelectItem key={country.code} value={country.code}>
//                 <span className='flex items-center gap-2'>
//                   {country.flag} {country.name}
//                 </span>
//               </SelectItem>
//             );
//           })}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

// export default CountriesInput;

'use client';

import { Label } from '@/components/ui/label';
import { formattedCountries } from '@/utils/countries';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const name = 'country';

const CountriesInput = ({ defaultValue }: { defaultValue?: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    formattedCountries.find((country) => country.code === defaultValue) ||
      formattedCountries[0]
  );

  const handleSelect = (currentValue: string) => {
    const country = formattedCountries.find(
      (c) => c.name.toLowerCase() === currentValue.toLowerCase()
    );

    if (country) setSelectedCountry(country);

    setOpen(false);
  };

  return (
    <div className='mb-2 space-y-1'>
      <input type='hidden' name={name} value={selectedCountry.code} />

      <Label htmlFor={name} className='capitalize'>
        {name}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full justify-between'>
            <span className='flex items-center gap-2'>
              {selectedCountry.flag} {selectedCountry.name}
            </span>
            <ChevronDown className=' h-3 w-3 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className='w-[var(--radix-popover-trigger-width)] p-0'
        >
          <Command>
            <CommandInput placeholder='Search country...' />
            <CommandList>
              <CommandGroup>
                {formattedCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCountry.code === country.code
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span className='flex items-center gap-2'>
                      {country.flag} {country.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CountriesInput;
