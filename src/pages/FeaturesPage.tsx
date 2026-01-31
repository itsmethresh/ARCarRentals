import type { FC } from 'react';
import { Container } from '@components/ui';

/**
 * Features page component (placeholder)
 */
export const FeaturesPage: FC = () => {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Features
          </h1>
          <p className="text-neutral-500">
            Explore our amazing features and services.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default FeaturesPage;
