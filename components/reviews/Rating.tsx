import { FaStar, FaRegStar } from 'react-icons/fa';

const Rating = ({ rating }: { rating: number }) => {
  const starts = Array.from({ length: 5 }, (_, i) => i + 1 <= rating);

  return (
    <div className='flex items-center gap-x-1'>
      {starts.map((isFilled, i) => {
        const className = `w-3 h-3 ${
          isFilled ? 'text-primary' : 'text-gray-400'
        }`;
        return isFilled ? (
          <FaStar key={i} className={className} />
        ) : (
          <FaRegStar key={i} className={className} />
        );
      })}
    </div>
  );
};

export default Rating;
