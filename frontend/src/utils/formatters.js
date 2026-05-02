import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return format(date, fmt);
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr) {
  return formatDate(dateStr, 'MMM d, yyyy · h:mm a');
}

/**
 * Relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Days until a date (returns negative if past)
 */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return null;
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Truncate long text
 */
export function truncate(str, length = 60) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '…' : str;
}

/**
 * Get initials from a name
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
