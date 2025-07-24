import EmptyList from '@/components/home/EmptyList';
import PropertiesList from '@/components/home/PropertiesList';
import PropertiesListInfiniteScroll from '@/components/home/PropertiesListInfiniteScroll';
import { fetchFavorites } from '@/utils/actions';

const FavoritesPage = async () => {
  const {
    properties: favorites,
    hasMore,
    nextCursor,
  } = await fetchFavorites({});

  if (!favorites || favorites.length === 0) return <EmptyList />;

  return (
    <PropertiesListInfiniteScroll
      initialProperties={favorites}
      initialHasMore={hasMore}
      initialNextCursor={nextCursor}
      action={fetchFavorites}
    />
  );
  return <PropertiesList properties={favorites} />;
};

export default FavoritesPage;
