import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contexts
import { ThemeProvider }   from './context/ThemeContext.jsx';
import { UserProvider }    from './context/UserContext.jsx';
import { TaskProvider }    from './context/TaskContext.jsx';
import { ActivityProvider }from './context/ActivityContext.jsx';
import { FilterProvider }  from './context/FilterContext.jsx';

// Layout
import Sidebar from './components/Layout/Sidebar.jsx';

// Pages
import BoardPage    from './pages/BoardPage.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import TeamPage     from './pages/TeamPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#09090b' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Routes>
          <Route path="/"         element={<BoardPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/team"     element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TaskProvider>
          <ActivityProvider>
            <FilterProvider>
              <BrowserRouter>
                <AppShell />
              </BrowserRouter>
            </FilterProvider>
          </ActivityProvider>
        </TaskProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
