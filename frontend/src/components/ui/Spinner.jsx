import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 14, md: 20, lg: 28, xl: 36 };
  return (
    <Loader2
      size={sizes[size]}
      className={cn('animate-spin text-brand-500', className)}
    />
  );
}
