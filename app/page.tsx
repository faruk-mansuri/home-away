import LoadingCards from '@/components/card/LoadingCards';
import CategoriesList from '@/components/home/CategoriesList';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import { Suspense } from 'react';

import db from '@/utils/db';

async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const searchParamsData = await searchParams;

  const properties = await db.property.findMany({});
  return (
    <section>
      <CategoriesList
        category={searchParamsData.category}
        search={searchParamsData.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParamsData.category}
          search={searchParamsData.search}
        />
      </Suspense>
    </section>
  );
}

export default HomePage;
