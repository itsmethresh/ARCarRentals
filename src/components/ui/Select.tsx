import type { FC } from 'react';
import { cn } from '@utils/helpers';
import type { SelectProps } from '@/types/components';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select component
 */
export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
}) => {
  const selectId = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-4 py-3 pr-10 text-neutral-900 transition-all duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-neutral-300',
            disabled && 'cursor-not-allowed bg-neutral-50 opacity-60',
            !value && 'text-neutral-400',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
