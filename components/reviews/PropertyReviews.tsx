import { fetchPropertyReviews } from '@/utils/actions';
import Title from '../properties/Title';
import ReviewCard from './ReviewCard';

const PropertyReviews = async ({ propertyId }: { propertyId: string }) => {
  const reviews = await fetchPropertyReviews(propertyId);

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className='mt-8'>
      <Title text='Reviews' />

      <div className='grid md:grid-cols-2 gap-8 mt-4'>
        {reviews.map((review) => {
          const { id, comment, rating, profile } = review;
          const { firstName, profileImage } = profile;
          const reviewInfo = {
            comment,
            rating,
            name: firstName,
            image: profileImage,
          };
          return <ReviewCard key={id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
};

export default PropertyReviews;
