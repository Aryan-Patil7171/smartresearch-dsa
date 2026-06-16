/**
 * Priority display helpers
 */
export const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40'   },
  high:     { label: 'High',     color: '#f97316', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: 'bg-amber-500/20',  text: 'text-amber-400',  border: 'border-amber-500/40'  },
  low:      { label: 'Low',      color: '#10b981', bg: 'bg-emerald-500/20',text: 'text-emerald-400',border: 'border-emerald-500/40' },
};

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
}
