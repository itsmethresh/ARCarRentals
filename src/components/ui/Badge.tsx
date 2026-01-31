import type { FC } from 'react';
import { cn } from '@utils/helpers';
import type { BadgeProps } from '@/types/components';

/**
 * Badge component for category labels
 */
export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    economy: 'bg-green-100 text-green-700',
    suv: 'bg-red-100 text-red-700',
    van: 'bg-blue-100 text-blue-700',
    luxury: 'bg-amber-100 text-amber-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md capitalize',
        variants[variant as keyof typeof variants] || variants.default,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
