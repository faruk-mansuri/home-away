'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { loadMorePropertiesAction } from '@/utils/actions';
import type { PropertyCardProps } from '@/utils/types';
import PropertyCard from '@/components/card/PropertyCard';
import Loader from '../properties/Loader';

interface PropertiesListInfiniteScrollProps {
  initialProperties: PropertyCardProps[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  category?: string;
  search?: string;
}

const PropertiesListInfiniteScroll = ({
  initialProperties,
  initialHasMore,
  initialNextCursor,
  category = '',
  search = '',
}: PropertiesListInfiniteScrollProps) => {
  const [properties, setProperties] =
    useState<PropertyCardProps[]>(initialProperties);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor
  );
  const [isPending, startTransition] = useTransition();
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset state when search or category changes
  useEffect(() => {
    setProperties(initialProperties);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [search, category, initialProperties, initialHasMore, initialNextCursor]);

  const loadMore = () => {
    if (!hasMore || isPending || !nextCursor) return;

    startTransition(async () => {
      const result = await loadMorePropertiesAction(
        search,
        category,
        nextCursor
      );

      if (result.success && result.data) {
        setProperties((prev) => [...prev, ...result.data.properties]);
        setHasMore(result.data.hasMore);
        setNextCursor(result.data.nextCursor);
      }
    });
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isPending, nextCursor]); // Dependencies ensure observer works with updated state

  return (
    <div className='properties-container'>
      {/* Properties Grid */}
      <div className='grid gap-8 mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Loading indicator */}
      {isPending && <Loader />}

      {/* Intersection observer target */}
      {hasMore && (
        <div
          ref={observerRef}
          className='h-20 flex items-center justify-center mt-8'
        >
          {!isPending && (
            <p className='text-gray-500'>Scroll down for more properties</p>
          )}
        </div>
      )}

      {/* End of results */}
      {!hasMore && properties.length > 0 && (
        <div className='text-center mt-8 text-gray-600'>
          <p>You&apos;ve reached the end of the results</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesListInfiniteScroll;
