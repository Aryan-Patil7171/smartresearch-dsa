/**
 * Reusable badge / tag pill
 */
export default function Badge({ children, color, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}22`, color, borderColor: `${color}44`, border: '1px solid' } : {}}
    >
      {children}
    </span>
  );
}
