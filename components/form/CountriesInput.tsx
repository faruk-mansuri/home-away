import { Label } from '@/components/ui/label';
import { formattedCountries } from '@/utils/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import React from 'react';

const name = 'country';
const CountriesInput = ({ defaultValue }: { defaultValue?: string }) => {
  return (
    <div className='mb-2 space-y-1'>
      <Label htmlFor={name} className='capitalize'>
        {name}
      </Label>

      <Select
        defaultValue={defaultValue || formattedCountries[0].code}
        name={name}
        required
      >
        <SelectTrigger id={name} className='w-full'>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {formattedCountries.map((country) => {
            return (
              <SelectItem key={country.code} value={country.code}>
                <span className='flex items-center gap-2'>
                  {country.flag} {country.name}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountriesInput;
