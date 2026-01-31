import type { FC } from 'react';
import { cn } from '@utils/helpers';
import type { ContainerProps } from '@/types/components';

/**
 * Container component for consistent page width
 */
export const Container: FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
}) => {
  const maxWidths = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        maxWidths[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
