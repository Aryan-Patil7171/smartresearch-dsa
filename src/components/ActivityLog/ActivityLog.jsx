import { useState, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Search, Activity, X } from 'lucide-react';
import { useActivity } from '../../context/ActivityContext.jsx';
import { getActivityIcon } from '../../data/activities.js';
import { formatDateTime } from '../../utils/date.js';

const ITEM_HEIGHT = 68;

function ActivityRow({ index, style, data }) {
  const act = data[index];
  return (
    <div style={style} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition border-b border-white/5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
        style={{ backgroundColor: act.userColor }}
      >
        {act.userAvatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 leading-snug">
          <span className="font-semibold text-white">{act.userName}</span>{' '}
          <span className="mr-1">{getActivityIcon(act.type)}</span>
          {act.message}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(act.timestamp)}</p>
      </div>
    </div>
  );
}

export default function ActivityLog({ onClose }) {
  const { activities } = useActivity();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return activities;
    const q = search.toLowerCase();
    return activities.filter(a =>
      a.message.toLowerCase().includes(q) ||
      a.userName.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    );
  }, [activities, search]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-indigo-400" />
          <h2 className="font-semibold text-white">Activity Log</h2>
          <span className="text-xs bg-white/10 text-gray-400 rounded-full px-2 py-0.5">{filtered.length}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="w-full bg-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Virtualized list */}
      <div className="flex-1 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">No activities found.</div>
        ) : (
          <List
            height={Math.min(filtered.length * ITEM_HEIGHT, 500)}
            itemCount={filtered.length}
            itemSize={ITEM_HEIGHT}
            itemData={filtered}
            width="100%"
            style={{ overflowY: 'auto' }}
          >
            {ActivityRow}
          </List>
        )}
      </div>
    </div>
  );
}
