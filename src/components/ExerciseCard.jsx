import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import SetRow from './SetRow';

const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

export default function ExerciseCard({ exercise, index, saveExercise, removeExercise, addSet, saveSet, removeSet }) {
  const [name, setName] = useState(exercise.name);
  const [group, setGroup] = useState(exercise.muscle_group);

  return (
    <div className="card border-l-4 border-neon-cyan">
      <div className="mb-3 flex items-center gap-2">
        <span className="w-6 text-center font-mono font-bold text-neon-cyan">
          {String(index + 1).padStart(2, '0')}
        </span>
        <input
          className="input-iron flex-1 font-bold"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => saveExercise(exercise.id, { name })}
        />
        <select
          className="input-iron w-28"
          value={group}
          onChange={(e) => { setGroup(e.target.value); saveExercise(exercise.id, { muscle_group: e.target.value }); }}
        >
          {MUSCLE_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button
          onClick={() => removeExercise(exercise.id)}
          className="rounded p-2 text-neon-magenta transition hover:bg-neon-magenta/10"
          aria-label="Delete exercise"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {exercise.sets?.map((s, i) => (
          <SetRow
            key={s.id}
            set={s}
            index={i}
            onChange={(u) => saveSet(s.id, u)}
            onDelete={() => removeSet(s.id)}
          />
        ))}
      </div>

      <button
        onClick={() => addSet(exercise.id, {
          set_number: (exercise.sets?.length || 0) + 1,
          reps: 10,
          weight: 0,
          completed: false
        })}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neon-cyan/30 bg-iron-bg px-3 py-2 text-xs font-bold text-neon-cyan transition hover:bg-neon-cyan/10"
      >
        <Plus className="h-4 w-4" /> Add Set
      </button>
    </div>
  );
}
