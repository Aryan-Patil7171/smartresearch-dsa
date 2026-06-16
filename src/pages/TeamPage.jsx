import Header from '../components/Layout/Header.jsx';
import TeamManager from '../components/Permissions/TeamManager.jsx';

export default function TeamPage() {
  return (
    <div className="flex flex-col h-full">
      <Header onFilterToggle={() => {}} filterOpen={false} />
      <div className="flex-1 overflow-hidden max-w-xl w-full mx-auto mt-6 bg-gray-900/60 rounded-2xl border border-white/10">
        <TeamManager />
      </div>
    </div>
  );
}
