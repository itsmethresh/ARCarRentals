import type { FC } from 'react';
import { cn } from '@utils/helpers';
import type { AvatarProps } from '@/types/components';

/**
 * Avatar component for user images
 */
export const Avatar: FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold',
        sizes[size],
        className
      )}
      role="img"
      aria-label={alt}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
};

export default Avatar;
