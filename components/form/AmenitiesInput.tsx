'use client';
import { useEffect, useState } from 'react';
import { amenities, Amenity } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

const AmenitiesInput = ({ defaultValue }: { defaultValue?: Amenity[] }) => {
  const amenitiesWithIcons = defaultValue?.map(({ name, selected }) => {
    return {
      name,
      selected,
      icon: amenities.find((amenity) => amenity.name === name)!.icon,
    };
  });
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
    amenitiesWithIcons || amenities
  );

  useEffect(() => {
    if (defaultValue) {
      const updated = defaultValue.map(({ name, selected }) => ({
        name,
        selected,
        icon: amenities.find((a) => a.name === name)!.icon,
      }));
      setSelectedAmenities(updated);
    }
  }, [defaultValue]);

  const handleChange = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.map((item) =>
        item.name === amenity.name
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };
  return (
    <section>
      <input
        type='hidden'
        name='amenities'
        value={JSON.stringify(selectedAmenities)}
      />

      <div className='grid grid-cols-2 gap-4'>
        {selectedAmenities.map((amenity) => {
          return (
            <div key={amenity.name} className='flex items-center space-x-2'>
              <Checkbox
                id={amenity.name}
                checked={amenity.selected}
                onCheckedChange={() => handleChange(amenity)}
                className='cursor-pointer'
              />
              <label
                htmlFor={amenity.name}
                className='cursor-pointer text-sm font-medium leading-none capitalize flex gap-x-2 items-center'
              >
                {amenity.name} <amenity.icon className='w-4 h-4' />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AmenitiesInput;
