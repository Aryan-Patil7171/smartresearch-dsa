import Header from '../components/Layout/Header.jsx';
import ActivityLog from '../components/ActivityLog/ActivityLog.jsx';

export default function ActivityPage() {
  return (
    <div className="flex flex-col h-full">
      <Header onFilterToggle={() => {}} filterOpen={false} />
      <div className="flex-1 overflow-hidden max-w-2xl w-full mx-auto mt-6 bg-gray-900/60 rounded-2xl border border-white/10">
        <ActivityLog />
      </div>
    </div>
  );
}
