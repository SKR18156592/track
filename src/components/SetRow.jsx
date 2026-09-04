import { Trash2 } from 'lucide-react';

export default function SetRow({ set, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-iron-border bg-iron-bg p-2">
      <span className="w-6 text-center font-mono text-sm font-bold text-neon-cyan">
        {set.set_number}
      </span>
      <input
        type="number"
        min="0"
        className="input-iron w-20"
        placeholder="reps"
        value={set.reps}
        onChange={(e) => onChange({ reps: parseInt(e.target.value, 10) || 0 })}
      />
      <input
        type="number"
        step="0.5"
        min="0"
        className="input-iron w-24"
        placeholder="kg"
        value={set.weight}
        onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })}
      />
      <button
        onClick={() => onChange({ completed: !set.completed })}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold transition ${
          set.completed
            ? 'border-neon-lime bg-neon-lime text-iron-bg shadow-[0_0_12px_rgba(57,255,20,0.4)]'
            : 'border-slate-500 text-slate-500 hover:border-neon-lime hover:text-neon-lime'
        }`}
        aria-label="Toggle set complete"
      >
        ✓
      </button>
      <button
        onClick={onDelete}
        className="rounded p-2 text-neon-magenta transition hover:bg-neon-magenta/10"
        aria-label="Delete set"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
