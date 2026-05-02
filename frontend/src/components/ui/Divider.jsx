import { cn } from '../../utils/cn';

export function Divider({ label, className }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3 my-4', className)}>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    );
  }
  return <hr className={cn('border-t border-gray-200 my-4', className)} />;
}
