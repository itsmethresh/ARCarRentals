import type { FC } from 'react';
import { Users, Fuel, Settings2 } from 'lucide-react';
import { Button } from './Button';
import type { Car } from '@/types';

type AvailabilityStatus = 'available' | 'left' | 'reserved' | 'booked';

interface CarCardProps {
  car: Car;
  onBookNow: () => void;
  showAvailability?: boolean;
  availabilityStatus?: AvailabilityStatus;
  leftCount?: number;
}

const getStatusConfig = (status: AvailabilityStatus, leftCount?: number) => {
  switch (status) {
    case 'available':
      return {
        bg: 'bg-[#22C55E]',
        text: 'AVAILABLE',
        icon: '●',
      };
    case 'left':
      return {
        bg: 'bg-[#F97316]',
        text: `${leftCount || 1} LEFT`,
        icon: '●',
      };
    case 'reserved':
      return {
        bg: 'bg-[#EAB308]',
        text: 'RESERVED',
        icon: '●',
      };
    case 'booked':
      return {
        bg: 'bg-[#EF4444]',
        text: 'BOOKED',
        icon: '●',
      };
    default:
      return {
        bg: 'bg-[#22C55E]',
        text: 'AVAILABLE',
        icon: '●',
      };
  }
};

/**
 * Reusable car card component matching Figma design
 */
export const CarCard: FC<CarCardProps> = ({ 
  car, 
  onBookNow, 
  showAvailability = false,
  availabilityStatus = 'available',
  leftCount,
}) => {
  const statusConfig = getStatusConfig(availabilityStatus, leftCount);

  return (
    <div 
      className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-full"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header: Name + Category Badge */}
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-neutral-900">
            {car.name}
          </h3>
          <span className="px-2.5 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full capitalize">
            {car.category}
          </span>
        </div>
      </div>

      {/* Car Image with Availability Badge Inside */}
      <div className="px-4">
        <div className="bg-neutral-50 rounded-lg overflow-hidden relative">
          {/* Availability Badge - Inside Image */}
          {showAvailability && (
            <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white rounded-full ${statusConfig.bg} z-10`}>
              {statusConfig.icon} {statusConfig.text}
            </span>
          )}
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-36 object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Specs Row */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between text-neutral-500">
          <div className="flex flex-col items-center gap-1">
            <Settings2 className="h-4 w-4" />
            <span className="text-xs capitalize">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span className="text-xs capitalize">{car.fuelType}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-neutral-200" />

      {/* Price & Book Now - Push to bottom */}
      <div className="px-4 py-4 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xl font-bold text-[#E22B2B]">
            ₱{car.pricePerDay.toLocaleString()}
          </span>
          <span className="text-neutral-400 text-sm">/day</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onBookNow}
          className="bg-[#E22B2B] hover:bg-[#c92525] border-none rounded-lg px-4 py-2 text-sm"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default CarCard;
