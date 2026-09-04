import { Dumbbell, History, Settings } from 'lucide-react';

const tabs = [
  { id: 'workouts', label: 'Workout', Icon: Dumbbell },
  { id: 'history', label: 'History', Icon: History },
  { id: 'settings', label: 'Settings', Icon: Settings }
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-iron-border bg-iron-panel/95 p-2 pb-6 backdrop-blur">
      <div className="mx-auto flex max-w-3xl justify-around">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-xs font-bold transition ${
              current === id ? 'text-neon-cyan bg-neon-cyan/10 shadow-[0_0_14px_rgba(0,243,255,0.2)]' : 'text-slate-400'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
