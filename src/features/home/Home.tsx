import { useFeaturedProducts } from './hooks/useFeaturedProducts';
import { useHomeCategories } from './hooks/useHomeCategories';
import { HeroSection } from './sections/HeroSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { FeaturedProducts } from './sections/FeaturedProducts';

export function Home() {
  const { products, loading: productsLoading } = useFeaturedProducts();
  const { categories, loading: categoriesLoading, error, onRetry } = useHomeCategories();

  return (
    <>
      <HeroSection />
      <CategoriesSection
        categories={categories}
        loading={categoriesLoading}
        error={error}
        onRetry={onRetry}
      />
      <FeaturedProducts products={products} loading={productsLoading} />
    </>
  );
}
