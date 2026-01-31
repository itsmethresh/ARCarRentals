import type { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container, Button } from '@components/ui';

/**
 * Call to Action section
 */
export const CTASection: FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary-600">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Book your perfect ride today and explore Cebu City in comfort and style. 
            Special rates available for long-term rentals!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-neutral-100"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
