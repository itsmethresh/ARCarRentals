import type { FC } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Container, Card, Avatar, Rating } from '@components/ui';
import type { Testimonial } from '@/types';

// Sample testimonial data
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Mark Santos',
    avatar: '',
    rating: 5,
    comment:
      'Excellent service! The car was brand new and the transaction was seamless. Highly recommended to anyone visiting Cebu.',
    location: 'Manila, Philippines',
    verified: true,
  },
  {
    id: '2',
    name: 'Emily Clarke',
    avatar: '',
    rating: 5,
    comment:
      'We booked the Bohol tour package and it was amazing. The driver was very professional and knew all the best spots!',
    location: 'Sydney, Australia',
    verified: true,
  },
  {
    id: '3',
    name: 'John D.',
    avatar: '',
    rating: 5,
    comment:
      'Best rates in Cebu City. The SUV was clean and powerful enough for our mountain trip. Will definitely book again.',
    location: 'Singapore',
    verified: true,
  },
];

/**
 * Testimonials section with customer reviews
 */
export const TestimonialsSection: FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Trusted by 500+ Travelers
            </h2>
            <div className="flex items-center gap-2">
              <Rating value={4.9} showValue />
              <span className="text-sm text-neutral-500">4.9/5 Rating on Google</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6" hoverable>
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={testimonial.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-neutral-900">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  {testimonial.location && (
                    <p className="text-sm text-neutral-500">{testimonial.location}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <Rating value={testimonial.rating} />
              </div>

              {/* Comment */}
              <p className="text-neutral-600 text-sm leading-relaxed">
                "{testimonial.comment}"
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
