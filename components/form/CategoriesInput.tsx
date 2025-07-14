import { Label } from '../ui/label';
import { categories } from '@/utils/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'category';

const CategoriesInput = ({ defaultValue }: { defaultValue?: string }) => {
  return (
    <div className='mb-2 space-y-1'>
      <Label htmlFor={name} className='capitalize'>
        Categories
      </Label>
      <Select
        defaultValue={defaultValue || categories[0].label}
        name={name}
        required
      >
        <SelectTrigger id={name} className='w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.label} value={category.label}>
              <span className='flex items-center gap-2'>
                <category.icon />
                {category.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoriesInput;
