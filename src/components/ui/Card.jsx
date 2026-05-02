import { cn } from '../../utils/cn';

export function Card({ children, className, hover = false, onClick, padding = 'md' }) {
  const paddings = { sm: 'p-4', md: 'p-5', lg: 'p-6', none: '' };
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-primary rounded-xl border border-border-col shadow-card',
        paddings[padding],
        hover && 'transition-all duration-200 hover:shadow-card-lg hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
