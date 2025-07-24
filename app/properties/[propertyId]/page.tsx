import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import PropertyRating from '@/components/card/PropertyRating';
import Amenities from '@/components/properties/Amenities';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import Description from '@/components/properties/Description';
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyDetails from '@/components/properties/PropertyDetails';
import ShareButton from '@/components/properties/ShareButton';
import UserInfo from '@/components/properties/UserInfo';
import PropertyReviews from '@/components/reviews/PropertyReviews';
import SubmitReview from '@/components/reviews/SubmitReview';
import { Separator } from '@/components/ui/separator';
import { fetchPropertyDetailsById, findExistingReview } from '@/utils/actions';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import DynamicPropertyMap from '@/components/properties/DynamicPropertyMap';
// const DynamicMap = dynamic(
//   () => import('@/components/properties/PropertyMap'),
//   {
//     // ssr: false,
//     loading: () => <Skeleton className='h-[400px] w-full' />,
//   }
// );

import DynamicBookingWrapper from '@/components/booking/DynamicBookingWrapper';
// const DynamicBookingWrapper = dynamic(
//   () => import('@/components/booking/BookingWrapper'),
//   {
//     // ssr: false,
//     loading: () => <Skeleton className='h-[200px] w-full' />,
//   }
// );

const SinglePropertyPage = async ({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) => {
  const { propertyId } = await params;
  const property = await fetchPropertyDetailsById(propertyId);
  if (!property) redirect('/');

  const {
    name,
    description,
    tagline,
    baths,
    bedrooms,
    beds,
    guests,
    image,
    amenities,
    country,
    price,
    bookings,
    favoriteId,
    reviewCount,
    rating,
  } = property;
  const details = { baths, bedrooms, beds, guests };

  const firstName = property.profile.firstName;
  const profileImage = property.profile.profileImage;
  const user = await auth();

  const isNotOwner = property.profile.clerkId !== user?.userId;
  const reviewDoesNotExist =
    user?.userId &&
    isNotOwner &&
    !(await findExistingReview(propertyId, user.userId));

  return (
    <section>
      <BreadCrumbs name={property.name} />
      <header className='flex justify-between items-center mt-4'>
        <h1 className='text-4xl font-bold capitalize'>{tagline}</h1>
        <div className='flex items-center gap-4'>
          {/* share button */}
          <ShareButton propertyId={propertyId} name={name} />

          <FavoriteToggleButton
            favoriteId={favoriteId}
            propertyId={propertyId}
          />
        </div>
      </header>

      <ImageContainer mainImage={image} name={name} />

      <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
        <div className='lg:col-span-8'>
          <div className='flex gap-4 place-items-center'>
            <h1 className='text-xl font-bold'>{name}</h1>
            <PropertyRating count={reviewCount} rating={rating} inPage={true} />
          </div>
          <PropertyDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className='mt-4' />
          <Description description={description} />
          <Amenities amenities={amenities} />
          <DynamicPropertyMap countryCode={country} />
        </div>

        <div className='lg:col-span-4 flex flex-col items-center'>
          <DynamicBookingWrapper
            propertyId={propertyId}
            price={price}
            bookings={bookings}
          />
        </div>
      </section>

      {reviewDoesNotExist && <SubmitReview propertyId={propertyId} />}
      <PropertyReviews propertyId={propertyId} />
    </section>
  );
};

export default SinglePropertyPage;
