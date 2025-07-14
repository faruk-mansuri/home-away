import LoadingCards from '@/components/card/LoadingCards';
import CategoriesList from '@/components/home/CategoriesList';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

async function HomePage({ searchParams }: PageProps) {
  const searchParamsData = await searchParams;

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
