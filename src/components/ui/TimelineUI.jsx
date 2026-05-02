import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { formatRelativeTime } from '../../utils/formatters';
import { STATUS_CONFIG } from './StatusBadge';

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

function Initials({ name }) {
  const parts = (name || '?').split(' ');
  const letters = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
  return (
    <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-brand-navy-900 uppercase">{letters}</span>
    </div>
  );
}

export function TimelineUI({ events = [], className }) {
  return (
    <motion.ol
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn('relative space-y-0', className)}
    >
      {events.map((event, i) => {
        const cfg = STATUS_CONFIG[event.action?.toLowerCase()] || {};
        const isLast = i === events.length - 1;

        return (
          <motion.li key={i} variants={itemVariants} className="relative flex gap-3">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border-col" />
            )}

            {/* Dot */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center border-2 border-bg-primary z-10',
                cfg.bg || 'bg-bg-secondary'
              )}>
                {event.user ? (
                  <Initials name={event.user} />
                ) : (
                  <div className={cn('w-2.5 h-2.5 rounded-full', cfg.dot || 'bg-fg-muted')} />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="pb-5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-fg-primary">{event.label || event.action}</p>
                <time className="text-xs text-fg-secondary whitespace-nowrap shrink-0">
                  {formatRelativeTime(event.timestamp || event.time)}
                </time>
              </div>
              {event.sub && (
                <p className="text-xs text-fg-secondary mt-0.5 truncate">{event.sub}</p>
              )}
              {event.note && (
                <p className="text-xs text-fg-secondary mt-1 p-2 bg-bg-secondary rounded-lg border border-border-col">
                  {event.note}
                </p>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
