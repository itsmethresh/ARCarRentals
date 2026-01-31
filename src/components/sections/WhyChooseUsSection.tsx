import type { FC } from 'react';
import { Car, Shield, Headphones, ThumbsUp } from 'lucide-react';
import { Container } from '@components/ui';

const features = [
  {
    icon: Car,
    title: 'Well-Maintained Fleet',
    description: 'All vehicles undergo regular maintenance and thorough cleaning before each rental.',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive insurance coverage for your peace of mind during your journey.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated team is available round the clock to assist you with any concerns.',
  },
  {
    icon: ThumbsUp,
    title: 'Best Price Guarantee',
    description: 'Competitive rates with no hidden fees. We match or beat any comparable offer.',
  },
];

const stats = [
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Vehicles' },
  { value: '5+', label: 'Years Experience' },
];

/**
 * Why Choose Us section
 */
export const WhyChooseUsSection: FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose AR Car Rentals?
            </h2>
            <p className="text-neutral-600 mb-8">
              With over 5 years of experience serving travelers in Cebu City, we've built a reputation for reliability, quality, and exceptional customer service.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image and Stats */}
          <div className="relative">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80"
                alt="Happy customers with rental car"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl md:text-3xl font-bold text-primary-600">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-neutral-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;
