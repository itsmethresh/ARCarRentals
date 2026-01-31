import { type FC, useState } from 'react';
import { Search, MapPin, Calendar, Car } from 'lucide-react';
import { Button, Container, Input, Select } from '@components/ui';

const carTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'economy', label: 'Economy' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sports', label: 'Sports' },
];

/**
 * Hero section with search form
 */
export const HeroSection: FC = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    carType: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    // eslint-disable-next-line no-console
    console.log('Search params:', searchParams);
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')]" />
      </div>

      {/* Red Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-600/20 to-transparent" />

      <Container className="relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              BEST{' '}
              <span className="text-primary-500">CAR RENTAL</span>{' '}
              AND TOUR SERVICES IN{' '}
              <span className="text-primary-500">CEBU CITY</span>
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
              Experience premium car rental services with our well-maintained fleet. 
              Perfect for business trips, family vacations, or exploring the beautiful island of Cebu.
            </p>
          </div>

          {/* Car Image Placeholder */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-10 -right-10 w-[500px] h-[300px] bg-gradient-to-br from-primary-600/30 to-transparent rounded-full blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"
              alt="Premium BMW car"
              className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Search Form */}
        <div className="mt-12 lg:mt-16">
          <form onSubmit={handleSearch}>
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-neutral-500 mb-2">
                    PICK-UP LOCATION
                  </label>
                  <Input
                    placeholder="City, Airport, or Address"
                    value={searchParams.location}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, location: e.target.value })
                    }
                    leftIcon={<MapPin className="h-5 w-5" />}
                    className="border-neutral-200"
                  />
                </div>

                {/* Date */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-neutral-500 mb-2">
                    DATE
                  </label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={searchParams.date}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, date: e.target.value })
                    }
                    leftIcon={<Calendar className="h-5 w-5" />}
                    className="border-neutral-200"
                  />
                </div>

                {/* Car Type */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-neutral-500 mb-2">
                    CAR TYPE
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 z-10" />
                    <Select
                      options={carTypeOptions}
                      value={searchParams.carType}
                      onChange={(value) =>
                        setSearchParams({ ...searchParams, carType: value })
                      }
                      placeholder="All Types"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<Search className="h-5 w-5" />}
                  >
                    Find Car
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
