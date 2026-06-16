import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_ACTIVITIES, ACTIVITY_TYPES } from '../data/activities.js';

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  const addActivity = useCallback((type, userId, userName, userAvatar, userColor, taskId, message) => {
    const entry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      userId,
      userName,
      userAvatar,
      userColor,
      taskId,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [entry, ...prev]);
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, ACTIVITY_TYPES }}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be inside ActivityProvider');
  return ctx;
};
