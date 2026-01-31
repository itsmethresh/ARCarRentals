import type { FC } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@utils/helpers';
import type { RatingProps } from '@/types/components';

/**
 * Rating component with star display
 */
export const Rating: FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 'md',
  showValue = false,
  readonly = true,
  onChange,
}) => {
  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxValue }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= value;
          const isHalfFilled = starValue > value && starValue - 0.5 <= value;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              disabled={readonly}
              className={cn(
                'focus:outline-none',
                !readonly && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              aria-label={`Rate ${starValue} out of ${maxValue}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled || isHalfFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-neutral-300'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-neutral-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
