import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-[var(--accent-gold)] text-brand-navy-900 hover:brightness-110 shadow-gold active:scale-[0.98]',
  secondary: 'bg-bg-secondary text-fg-primary border border-border-col hover:bg-bg-tertiary hover:border-[var(--border-strong)] shadow-card',
  ghost:     'text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  link:      'text-[var(--accent-gold)] hover:brightness-110 underline-offset-4 hover:underline p-0 h-auto',
  indigo:    'bg-brand2-500 text-white hover:bg-brand2-600 shadow-md hover:shadow-lg active:scale-[0.98]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1',
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
  xl: 'px-8 py-4 text-lg rounded-xl gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  icon,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'lg' ? 18 : 16} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
