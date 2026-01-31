import type { FC } from 'react';
import { Container } from '@components/ui';

/**
 * Pricing page component (placeholder)
 */
export const PricingPage: FC = () => {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Pricing
          </h1>
          <p className="text-neutral-500">
            Transparent pricing with no hidden fees.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default PricingPage;
