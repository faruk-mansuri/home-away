import { Input } from '../ui/input';
import { Label } from '../ui/label';

type PriceInputProps = {
  defaultValue?: number;
};
const PriceInput = ({ defaultValue }: PriceInputProps) => {
  const name = 'price';
  return (
    <div className='mb-2 space-y-1'>
      <Label htmlFor={name} className='capitalize'>
        Price
      </Label>

      <Input
        id={name}
        name={name}
        type='number'
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  );
};

export default PriceInput;
