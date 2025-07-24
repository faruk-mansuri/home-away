import { fetchProperties } from '@/utils/actions';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';
import PropertiesListInfiniteScroll from './PropertiesListInfiniteScroll';

const PropertiesContainer = async ({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) => {
  const {
    properties,
    hasMore,
    nextCursor,
  }: {
    properties: PropertyCardProps[];
    hasMore: boolean;
    nextCursor: string | null;
  } = await fetchProperties({
    category,
    search,
  });

  if (!properties || properties.length === 0) {
    return (
      <EmptyList
        heading='No properties found'
        message='Try changing the search or category.'
        btnText='Back to Home'
      />
    );
  }

  return (
    <PropertiesListInfiniteScroll
      initialProperties={properties}
      initialHasMore={hasMore}
      initialNextCursor={nextCursor}
      category={category}
      search={search}
    />
  );
};

export default PropertiesContainer;
