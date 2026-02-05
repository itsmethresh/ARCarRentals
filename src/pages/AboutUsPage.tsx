import { type FC } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * About Us Page - Company story, values, and vision
 */
export const AboutUsPage: FC = () => {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* Header - Centered */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">ABOUT US</h1>
        <p className="text-sm">
          <span className="text-neutral-500">Home</span>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-neutral-900">About Us</span>
        </p>
      </div>

      {/* First Section - Hero Image + 3 Column Content */}
      <section className="pt-8 pb-16 bg-white">
        <div className="mx-auto w-full max-w-[1600px]" style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {/* Hero Image - Centered with Rounded Corners */}
          <div className="mb-16">
            <img
              src="/aboutUsHero.png"
              alt="Professional car rental service in Cebu - Premium vehicle fleet"
              className="w-full h-[500px] object-cover rounded-[24px] shadow-lg"
            />
          </div>

          {/* 3 Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Column 1 - Title */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
                Your journey starts with the perfect vehicle
              </h2>
            </div>

            {/* Column 2 - Features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Wide Selection of Vehicles</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Choose from our extensive selection of premium vehicles featuring top automotive brands including Toyota, Mitsubishi, and Hyundai. Whether you need a sedan for corporate travel or an SUV for family getaways, we have the ideal vehicle for your Cebu adventure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Unlimited Mileage Options</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Drive on your schedule with our flexible rental packages and generous mileage policies. From Oslob's whale shark watching to Moalboal's beaches, explore every corner of Cebu at your leisure without restrictions or kilometer limits.
                </p>
              </div>
            </div>

            {/* Column 3 - More Features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">24/7 Customer Assistance</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Benefit from round-the-clock roadside assistance and customer care during your entire rental period. Our responsive support team is always ready to help, ensuring safe and stress-free travels throughout Cebu and beyond.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Easy Booking Management</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Adjust your rental schedule, switch vehicles, or extend your booking effortlessly through our user-friendly system. We accommodate last-minute changes and provide flexible policies that work around your travel needs without additional hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Two Column: Content + Image */}
      <section className="py-20 bg-white">
        <div className="mx-auto w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 leading-tight">
              Experience seamless<br />
              travel across Cebu
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed mb-8">
              With AR Car Rentals, every rental is more than just transportation—it's your passport to incredible experiences. We deliver dependable vehicles, transparent service, and the independence you need to make the most of your Cebu journey.
            </p>

            {/* Feature List with Check Icons - 2 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#E22B2B] flex-shrink-0 mt-0.5" />
                <p className="text-neutral-700 text-sm">
                  <strong>Fully Comprehensive Insurance:</strong> Every rental includes complete insurance coverage, protecting you and your loved ones throughout your entire journey.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#E22B2B] flex-shrink-0 mt-0.5" />
                <p className="text-neutral-700 text-sm">
                  <strong>Premium Quality Interiors:</strong> All vehicles feature luxurious interiors with modern amenities and spotless cabins for ultimate comfort.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#E22B2B] flex-shrink-0 mt-0.5" />
                <p className="text-neutral-700 text-sm">
                  <strong>Transparent Pricing Policy:</strong> See your complete rental cost upfront with zero hidden fees or surprise charges.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#E22B2B] flex-shrink-0 mt-0.5" />
                <p className="text-neutral-700 text-sm">
                  <strong>Years of Trusted Service:</strong> Benefit from our extensive experience serving thousands of satisfied travelers across Cebu.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-[24px] overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80"
                alt="Premium car rental experience - Luxury vehicles in Cebu"
                className="w-full h-[500px] object-cover"
              />
              {/* Gradient overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section - Testimonials/Sentiments */}
      <section className="py-20 bg-white">
        <div className="mx-auto w-full max-w-[1600px]" style={{ paddingInline: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Trusted by 500+ Travelers
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-neutral-600 font-medium">5.0 Overall rating</span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="text-neutral-700 font-bold text-lg">RJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Rob Jones</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                "Amazing service! The Toyota Innova was spotless and perfect for our family trip to Oslob. The booking process was seamless, and the staff was incredibly helpful throughout our journey."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="text-neutral-700 font-bold text-lg">SC</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Sofia Cruz</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                "Best car rental in Cebu! Transparent pricing with no hidden fees, and the Fortuner was in excellent condition. The 24/7 support gave us peace of mind during our entire trip."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="text-neutral-700 font-bold text-lg">ML</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Mark Lee</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                "Highly recommend AR Car Rentals! Professional service from start to finish. The vehicle was delivered on time, and the flexible rental terms made planning our Cebu adventure stress-free."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
