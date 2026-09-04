import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ExerciseCard from './ExerciseCard';

export default function WorkoutDetail({ workout, onBack, saveWorkout, removeWorkout, addExercise, removeExercise, saveExercise, addSet, saveSet, removeSet }) {
  const [title, setTitle] = useState(workout.title);
  const [notes, setNotes] = useState(workout.notes || '');
  const [date, setDate] = useState(workout.date);
  const [completed, setCompleted] = useState(workout.completed);

  const update = (u) => saveWorkout(workout.id, u);

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-neon-cyan">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="card flex flex-col gap-3">
        <input
          className="input-iron text-lg font-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => update({ title })}
        />
        <input
          type="date"
          className="input-iron"
          value={date}
          onChange={(e) => { setDate(e.target.value); update({ date: e.target.value }); }}
        />
        <textarea
          className="input-iron"
          rows="2"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => update({ notes })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-neon-lime"
            checked={completed}
            onChange={(e) => { setCompleted(e.target.checked); update({ completed: e.target.checked }); }}
          />
          <span>Mark workout complete</span>
        </label>
      </div>

      {workout.exercises?.map((e, i) => (
        <ExerciseCard
          key={e.id}
          exercise={e}
          index={i}
          saveExercise={saveExercise}
          removeExercise={removeExercise}
          addSet={addSet}
          saveSet={saveSet}
          removeSet={removeSet}
        />
      ))}

      <button
        onClick={() => addExercise(workout.id, {
          name: 'New Exercise',
          muscle_group: 'chest',
          order_index: workout.exercises?.length || 0
        })}
        className="btn-lime w-full"
      >
        + Add Exercise
      </button>

      <button
        onClick={() => { removeWorkout(workout.id); onBack(); }}
        className="btn-magenta w-full"
      >
        Delete Workout
      </button>
    </div>
  );
}
