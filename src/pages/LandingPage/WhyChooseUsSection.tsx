import type { FC } from 'react';
import { CalendarPlus, Car, Smile } from 'lucide-react';

const steps = [
  {
    icon: CalendarPlus,
    title: '1. Choose Date',
    description: 'Select your preferred pick-up and drop-off dates and location.',
  },
  {
    icon: Car,
    title: '2. Pick Car',
    description: 'Browse our wide range of fleet and choose the one that suits you.',
  },
  {
    icon: Smile,
    title: '3. Enjoy the Ride',
    description: 'Pick up your car and enjoy your trip around Cebu with peace of mind.',
  },
];

/**
 * How It Works section
 */
export const WhyChooseUsSection: FC = () => {
  return (
    <section 
      className="bg-[#F0F0F0] flex items-center justify-center py-12 sm:py-16 lg:py-0"
      style={{ 
        minHeight: '400px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="text-center px-4 sm:px-6">
        {/* Section Header */}
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
          How It Works
        </h2>
        <p className="text-neutral-500 mb-8 sm:mb-12">
          Rent your car in 3 simple steps
        </p>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-24">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center max-w-[240px]">
              {/* Icon Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 sm:mb-6">
                <step.icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#E22B2B]" />
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-neutral-900 mb-2">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-neutral-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
