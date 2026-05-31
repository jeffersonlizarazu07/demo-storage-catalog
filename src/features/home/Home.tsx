import { HeroSection } from './sections/HeroSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { FeaturedProducts } from './sections/FeaturedProducts';

export function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
    </>
  );
}
