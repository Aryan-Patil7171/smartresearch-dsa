import Header from '../components/Layout/Header.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useTask } from '../context/TaskContext.jsx';
import { Sun, Moon, Trash2, Download, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useUser();
  const { tasks } = useTask();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clouddesk-tasks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearStorage = () => {
    if (confirm('This will reset all tasks and preferences to defaults. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header onFilterToggle={() => {}} filterOpen={false} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>

          {/* Appearance */}
          <section className="bg-gray-900/60 rounded-2xl border border-white/10 p-5">
            <h2 className="font-semibold text-white mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Theme</p>
                <p className="text-xs text-gray-500 mt-0.5">Switch between dark and light mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 text-sm text-gray-200 transition"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </section>

          {/* Data */}
          <section className="bg-gray-900/60 rounded-2xl border border-white/10 p-5">
            <h2 className="font-semibold text-white mb-4">Data</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Export Tasks</p>
                  <p className="text-xs text-gray-500 mt-0.5">Download all tasks as JSON</p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition"
                >
                  <Download size={14} /> Export
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Reset Workspace</p>
                  <p className="text-xs text-gray-500 mt-0.5">Clear all localStorage data and reload</p>
                </div>
                <button
                  onClick={handleClearStorage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm transition"
                >
                  <Trash2 size={14} /> Reset
                </button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="bg-gray-900/60 rounded-2xl border border-white/10 p-5">
            <h2 className="font-semibold text-white mb-3">About CloudDesk</h2>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Version: 1.0.0</p>
              <p>Stack: React 19 · Vite · Tailwind CSS · Framer Motion</p>
              <p>Logged in as: <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.role})</p>
              <p className="mt-2 text-xs text-gray-600">All data is stored in your browser's localStorage.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
