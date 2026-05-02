import { motion } from 'framer-motion';
import { MoreHorizontal, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function ContractCard({ contract, onClick, onMenuClick, priority = false }) {
  const { title, client, amount, status, createdAt, updatedAt } = contract;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        'group relative bg-bg-primary rounded-xl border cursor-pointer overflow-hidden',
        'hover:shadow-card-lg transition-shadow duration-200',
        priority
          ? 'border-l-4 border-[var(--accent-gold)] border-t border-r border-b border-border-col'
          : 'border-border-col'
      )}
    >
      {/* Gold left accent for priority */}
      {priority && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-gold)]" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <StatusBadge status={status} size="xs" showDot />
          <button
            onClick={(e) => { e.stopPropagation(); onMenuClick?.(e); }}
            className="p-1 rounded-lg text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="font-serif text-base font-medium text-fg-primary leading-snug mb-1 line-clamp-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h3>

        {/* Client */}
        <p className="text-sm text-fg-secondary mb-4 truncate">{client}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-col">
          <span className="text-sm font-semibold text-fg-primary">
            {formatCurrency(amount)}
          </span>
          <span className="flex items-center gap-1 text-xs text-fg-secondary">
            <Calendar size={11} />
            {formatRelativeTime(updatedAt || createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
