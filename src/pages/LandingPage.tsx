import type { FC } from 'react';
import {
  HeroSection,
  TestimonialsSection,
  FeaturedFleetSection,
  WhyChooseUsSection,
  CTASection,
} from '@components/sections';

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
      <CTASection />
    </>
  );
};

export default LandingPage;
