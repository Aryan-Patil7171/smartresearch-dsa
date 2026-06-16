import { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext(null);

const defaultFilters = {
  tags: [],
  priorities: [],
  assignees: [],
  statuses: [],
  search: '',
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('cd_filters');
      return saved ? JSON.parse(saved) : defaultFilters;
    } catch { return defaultFilters; }
  });

  useEffect(() => {
    try { localStorage.setItem('cd_filters', JSON.stringify(filters)); } catch {}
  }, [filters]);

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const setSearch = (value) => setFilters(prev => ({ ...prev, search: value }));

  const clearFilters = () => setFilters(defaultFilters);

  const hasActiveFilters = filters.tags.length > 0 || filters.priorities.length > 0 ||
    filters.assignees.length > 0 || filters.statuses.length > 0 || filters.search !== '';

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, setSearch, clearFilters, hasActiveFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be inside FilterProvider');
  return ctx;
};
