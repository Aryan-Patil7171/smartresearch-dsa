/**
 * User avatar – shows initials with a colored background
 */
export default function Avatar({ user, size = 'sm' }) {
  if (!user) return null;
  const sizes = { xs: 'w-5 h-5 text-xs', sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div
      title={user.name}
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none`}
      style={{ backgroundColor: user.color || '#6366f1' }}
    >
      {user.avatar || user.name?.slice(0, 2).toUpperCase()}
    </div>
  );
}
