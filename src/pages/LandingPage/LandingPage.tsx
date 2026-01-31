import type { FC } from 'react';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FeaturedFleetSection } from './FeaturedFleetSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { PopularToursSection } from './PopularToursSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';

/**
 * Landing/Home page component
 */
export const LandingPage: FC = () => {
  return (
    <>
      <HeroSection />
      <TestimonialsSection />
      <FeaturedFleetSection />
      <WhyChooseUsSection />
      <PopularToursSection />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default LandingPage;
