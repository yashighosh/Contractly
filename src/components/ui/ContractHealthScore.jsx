import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

const CHECKS = [
  { key: 'title',    label: 'Title set' },
  { key: 'client',   label: 'Client named' },
  { key: 'amount',   label: 'Value defined' },
  { key: 'clauses',  label: 'Clauses added' },
  { key: 'expiry',   label: 'Expiry date' },
];

function computeScore(fields) {
  const passed = CHECKS.filter((c) => !!fields[c.key]).length;
  return Math.round((passed / CHECKS.length) * 100);
}

function Arc({ score, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const dashOffset = useTransform(spring, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    spring.set(score);
  }, [score]);

  const color = score >= 80 ? 'var(--accent-emerald)' : score >= 50 ? 'var(--accent-gold)' : '#EF4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-default)" strokeWidth={stroke} />
      {/* Progress */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      />
    </svg>
  );
}

export function ContractHealthScore({ fields = {}, size = 'md', className }) {
  const score = computeScore(fields);
  const sizePx = size === 'sm' ? 80 : size === 'lg' ? 160 : 120;
  const strokePx = size === 'sm' ? 7 : size === 'lg' ? 14 : 10;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl';

  const color = score >= 80 ? 'text-brand-emerald-500' : score >= 50 ? 'text-[var(--accent-gold)]' : 'text-red-500';
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Fair' : 'Incomplete';

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Ring */}
      <div className="relative" style={{ width: sizePx, height: sizePx }}>
        <Arc score={score} size={sizePx} stroke={strokePx} />
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn('font-bold leading-none', textSize, color)}
          >
            {score}%
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={cn('text-sm font-semibold', color)}>{label}</p>
        <p className="text-xs text-fg-secondary mt-0.5">Contract health</p>
      </div>

      {/* Checklist */}
      {size !== 'sm' && (
        <div className="w-full space-y-1.5 mt-1">
          {CHECKS.map((c) => {
            const done = !!fields[c.key];
            return (
              <div key={c.key} className="flex items-center gap-2">
                <div className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0',
                  done ? 'bg-brand-emerald-500' : 'bg-border-col'
                )}>
                  {done && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={cn('text-xs', done ? 'text-fg-primary' : 'text-fg-secondary line-through opacity-60')}>
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
