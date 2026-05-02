import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// ── Skeleton primitives ───────────────────────────────────

function SkeletonBox({ className }) {
  return (
    <div className={cn('skeleton rounded-lg', className)} />
  );
}

// ── Variants ─────────────────────────────────────────────

export function SkeletonText({ lines = 2, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={cn('h-3.5', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-bg-primary border border-border-col rounded-xl p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <SkeletonBox className="h-5 w-20 rounded-full" />
        <SkeletonBox className="h-5 w-5 rounded-lg" />
      </div>
      <SkeletonBox className="h-5 w-full mb-2" />
      <SkeletonBox className="h-4 w-2/3 mb-5" />
      <div className="flex items-center justify-between pt-3 border-t border-border-col">
        <SkeletonBox className="h-5 w-24" />
        <SkeletonBox className="h-4 w-16" />
      </div>
    </div>
  );
}

export function SkeletonRow({ cols = 5, className }) {
  const widths = ['w-32', 'w-24', 'w-16', 'w-20', 'w-12'];
  return (
    <div className={cn('flex items-center gap-4 px-5 py-3.5 border-b border-border-col', className)}>
      <SkeletonBox className="h-4 w-4 rounded" />
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} className={cn('h-3.5', widths[i % widths.length])} />
      ))}
    </div>
  );
}

export function SkeletonStatCard({ className }) {
  return (
    <div className={cn('bg-bg-primary border border-border-col rounded-xl p-5 border-t-4 border-t-border-col', className)}>
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-10 w-10 rounded-xl" />
        <SkeletonBox className="h-4 w-16 rounded-full" />
      </div>
      <SkeletonBox className="h-8 w-24 mb-1" />
      <SkeletonBox className="h-3.5 w-32 mb-4" />
      <SkeletonBox className="h-8 w-full rounded" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBox className="h-7 w-48" />
          <SkeletonBox className="h-4 w-64" />
        </div>
        <SkeletonBox className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="bg-bg-primary border border-border-col rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-col">
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-5 w-16" />
        </div>
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </div>
  );
}

// Default export for generic usage
export function Skeleton({ className }) {
  return <SkeletonBox className={className} />;
}
