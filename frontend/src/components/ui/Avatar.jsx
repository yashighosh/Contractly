import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
};

export function Avatar({ name, src, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold',
        'flex items-center justify-center ring-2 ring-white shrink-0',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
