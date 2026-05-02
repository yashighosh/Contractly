import { Button } from './Button';
import { cn } from '../../utils/cn';

export function EmptyState({ illustration, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      {/* Illustration placeholder */}
      <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-12 h-12 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="16" y="10" width="48" height="60" rx="4" />
          <path d="M28 26h24M28 36h24M28 46h16" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-xs">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}
