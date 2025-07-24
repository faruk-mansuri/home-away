'use client';
import { useAuth } from '@clerk/nextjs';
import { CardSignInButton } from '../form/Buttons';
import FavoriteToggleForm from './FavoriteToggleForm';

const FavoriteToggleButton = ({
  propertyId,
  favoriteId,
}: {
  propertyId: string;
  favoriteId: string | null;
}) => {
  const { userId } = useAuth();
  if (!userId) return <CardSignInButton />;

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
};

export default FavoriteToggleButton;
