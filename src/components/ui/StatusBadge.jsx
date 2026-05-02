import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, Send, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

export const STATUS_CONFIG = {
  draft:   { label: 'Draft',    icon: FileText,      bg: 'bg-slate-100 dark:bg-slate-800',   text: 'text-slate-600 dark:text-slate-300',   dot: 'bg-slate-400' },
  sent:    { label: 'Sent',     icon: Send,          bg: 'bg-blue-50  dark:bg-blue-900/30',  text: 'text-blue-600 dark:text-blue-300',     dot: 'bg-blue-400' },
  viewed:  { label: 'Viewed',   icon: Eye,           bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-300',   dot: 'bg-amber-400' },
  pending: { label: 'Pending',  icon: Clock,         bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-300',   dot: 'bg-amber-400 animate-pulse' },
  signed:  { label: 'Signed',   icon: CheckCircle,   bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-300', dot: 'bg-emerald-500' },
  expired: { label: 'Expired',  icon: AlertTriangle, bg: 'bg-red-50   dark:bg-red-900/30',   text: 'text-red-500   dark:text-red-300',     dot: 'bg-red-400' },
  voided:  { label: 'Voided',   icon: XCircle,       bg: 'bg-gray-100 dark:bg-gray-800',    text: 'text-gray-500  dark:text-gray-400',     dot: 'bg-gray-400' },
  renewed: { label: 'Renewed',  icon: CheckCircle,   bg: 'bg-brand-emerald-100 dark:bg-emerald-900/30', text: 'text-brand-emerald-600 dark:text-brand-emerald-300', dot: 'bg-brand-emerald-500' },
};

export function StatusBadge({ status, size = 'sm', showIcon = true, showDot = false }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = cfg.icon;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full whitespace-nowrap',
      cfg.bg, cfg.text, sizeClasses[size]
    )}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />}
      {showIcon && !showDot && <Icon size={size === 'md' ? 13 : 11} className="shrink-0" />}
      {cfg.label}
    </span>
  );
}
