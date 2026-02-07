import { type FC, type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
}

/**
 * Reusable Modal component with dark theme overlay
 */
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
    'full': 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col',
          'animate-in fade-in zoom-in-95 duration-200',
          'sm:mx-4',
          sizeClasses[size]
        )}
      >
        {/* Close button - always show in top right */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header - only show if title exists */}
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 pr-8">{title}</h2>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
