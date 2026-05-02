import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(function Input(
  { label, error, hint, icon, iconRight, className, containerClassName, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-fg-secondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-fg-muted pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-border-col bg-bg-secondary px-3 py-2 text-sm text-fg-primary',
            'placeholder:text-fg-muted',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/25 focus:border-[var(--accent-gold)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-9',
            iconRight && 'pr-9',
            error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 text-fg-muted flex items-center">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-fg-muted">{hint}</p>}
    </div>
  );
});
