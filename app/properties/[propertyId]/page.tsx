import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import PropertyRating from '@/components/card/PropertyRating';
import Amenities from '@/components/properties/Amenities';
import BookingCalender from '@/components/properties/BookingCalender';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import Description from '@/components/properties/Description';
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyDetails from '@/components/properties/PropertyDetails';
import ShareButton from '@/components/properties/ShareButton';
import UserInfo from '@/components/properties/UserInfo';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPropertyDetailsById } from '@/utils/actions';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const DynamicMap = dynamic(
  () => import('@/components/properties/PropertyMap'),
  {
    // ssr: false,
    loading: () => <Skeleton className='h-[400px] w-full' />,
  }
);

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
  } = property;
  const details = { baths, bedrooms, beds, guests };

  const firstName = property.profile.firstName;
  const profileImage = property.profile.profileImage;

  return (
    <section>
      <BreadCrumbs name={property.name} />
      <header className='flex justify-between items-center mt-4'>
        <h1 className='text-4xl font-bold capitalize'>{tagline}</h1>
        <div className='flex items-center gap-4'>
          {/* share button */}
          <ShareButton propertyId={propertyId} name={name} />

          <FavoriteToggleButton propertyId={propertyId} />
        </div>
      </header>

      <ImageContainer mainImage={image} name={name} />

      <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
        <div className='lg:col-span-8'>
          <div className='flex gap-4 place-items-center'>
            <h1 className='text-xl font-bold'>{name}</h1>
            <PropertyRating inPage={true} propertyId={propertyId} />
          </div>
          <PropertyDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className='mt-4' />
          <Description description={description} />
          <Amenities amenities={amenities} />
          <DynamicMap countryCode={country} />
        </div>

        <div className='lg:col-span-4 flex flex-col items-center'>
          <BookingCalender />
        </div>
      </section>
    </section>
  );
};

export default SinglePropertyPage;
