import type { FC } from 'react';
import { Shield, Clock, Award, Headphones } from 'lucide-react';
import { Container } from '@components/ui';

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'All our vehicles are fully insured and regularly maintained for your safety.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book anytime, anywhere. Our service is available round the clock.',
  },
  {
    icon: Award,
    title: 'Best Rates',
    description: 'Competitive pricing with no hidden fees. Get the best value for your money.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Our dedicated team is always ready to assist you with any inquiries.',
  },
];

/**
 * Why Choose Us section
 */
export const WhyChooseUsSection: FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Why Choose AR Car Rentals?
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            We're committed to providing exceptional car rental services that exceed your expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl transition-all duration-300 hover:bg-neutral-50"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 mb-5">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-500 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;
