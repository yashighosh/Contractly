import { cn } from '../../utils/cn';

const STATUS_STYLES = {
  draft:   'bg-gray-100 text-gray-600 border-gray-200',
  sent:    'bg-blue-50 text-blue-600 border-blue-100',
  viewed:  'bg-amber-50 text-amber-600 border-amber-100',
  signed:  'bg-green-50 text-green-700 border-green-100',
  expired: 'bg-red-50 text-red-600 border-red-100',
  renewed: 'bg-violet-50 text-violet-600 border-violet-100',
};

const DOT_STYLES = {
  draft:   'bg-gray-400',
  sent:    'bg-blue-500 animate-pulse',
  viewed:  'bg-amber-500',
  signed:  'bg-green-500',
  expired: 'bg-red-500',
  renewed: 'bg-violet-500',
};

const STATUS_LABELS = {
  draft:   'Draft',
  sent:    'Sent',
  viewed:  'Viewed',
  signed:  'Signed',
  expired: 'Expired',
  renewed: 'Renewed',
};

export function Badge({ status, label, className }) {
  const s = status?.toLowerCase() || 'draft';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        STATUS_STYLES[s] || STATUS_STYLES.draft,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_STYLES[s] || DOT_STYLES.draft)} />
      {label || STATUS_LABELS[s] || s}
    </span>
  );
}
