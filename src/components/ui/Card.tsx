import type { FC } from 'react';
import { cn } from '@utils/helpers';
import type { CardProps } from '@/types/components';

/**
 * Reusable Card component
 */
export const Card: FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  bordered = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl',
        'shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
        bordered && 'border border-neutral-200',
        hoverable && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
