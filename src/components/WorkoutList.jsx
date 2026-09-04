import { Calendar, Trash2 } from 'lucide-react';

export default function WorkoutList({ workouts, onSelect, onAdd, onDelete }) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onAdd} className="btn-neon w-full">+ New Workout</button>
      {workouts.map((w) => (
        <div
          key={w.id}
          onClick={() => onSelect(w.id)}
          className="card cursor-pointer transition hover:border-neon-cyan/40"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-bold text-slate-100">{w.title}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {w.date} • {w.exercises?.length || 0} exercises
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {w.completed && (
                <span className="rounded bg-neon-lime/20 px-2 py-1 text-xs font-bold text-neon-lime">Done</span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(w.id); }}
                className="rounded p-2 text-neon-magenta transition hover:bg-neon-magenta/10"
                aria-label="Delete workout"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {workouts.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-400">
          No workouts yet. Tap + New Workout to start.
        </p>
      )}
    </div>
  );
}
