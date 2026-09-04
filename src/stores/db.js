import { supabase } from '../supabaseClient';

export async function getWorkouts(userId) {
  const { data: w, error: wErr } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (wErr) throw wErr;
  if (!w?.length) return [];

  const wids = w.map((x) => x.id);
  const { data: e, error: eErr } = await supabase
    .from('exercises')
    .select('*')
    .in('workout_id', wids)
    .order('order_index');
  if (eErr) throw eErr;

  const eids = (e || []).map((x) => x.id);
  const { data: s, error: sErr } = await supabase
    .from('sets')
    .select('*')
    .in('exercise_id', eids)
    .order('set_number');
  if (sErr) throw sErr;

  const emap = {};
  for (const x of e || []) emap[x.id] = { ...x, sets: [] };
  for (const x of s || []) emap[x.exercise_id]?.sets.push(x);

  return w.map((x) => ({ ...x, exercises: Object.values(emap).filter((ex) => ex.workout_id === x.id) }));
}

export const insertWorkout = (w) => supabase.from('workouts').insert(w).select().single();
export const updateWorkout = (id, u) => supabase.from('workouts').update(u).eq('id', id);
export const deleteWorkout = (id) => supabase.from('workouts').delete().eq('id', id);
export const insertExercise = (e) => supabase.from('exercises').insert(e).select().single();
export const updateExercise = (id, u) => supabase.from('exercises').update(u).eq('id', id);
export const deleteExercise = (id) => supabase.from('exercises').delete().eq('id', id);
export const insertSet = (s) => supabase.from('sets').insert(s).select().single();
export const updateSet = (id, u) => supabase.from('sets').update(u).eq('id', id);
export const deleteSet = (id) => supabase.from('sets').delete().eq('id', id);

const ROUTINE = {
  'Day 1 — Chest • Shoulders • Biceps': [
    ['Incline Upper Chest Press', 'chest'],
    ['Mid Chest Isolation', 'chest'],
    ['Lower Chest Isolation', 'chest'],
    ['Overhead Shoulder Press', 'shoulders'],
    ['Side Delt Isolation', 'shoulders'],
    ['Biceps Mid-Range / Peak', 'arms'],
    ['Biceps Lengthened Stretch', 'arms'],
    ['Brachialis & Width', 'arms']
  ],
  'Day 2 — Legs • Calves • Core': [
    ['Barbell Smith Back Squat', 'legs'],
    ['Leg Extension', 'legs'],
    ['Unilateral Quad / Glute Press', 'legs'],
    ['Hamstring Isolation', 'legs'],
    ['Hip Adduction', 'legs'],
    ['Hip Abduction', 'legs'],
    ['Calf Isolation', 'legs'],
    ['Lower Abs', 'core'],
    ['Upper / Total Abs', 'core']
  ],
  'Day 3 — Back • Rear • Triceps • Traps': [
    ['Upper / Mid Back Thickness', 'back'],
    ['Vertical Pull / Lat Width', 'back'],
    ['Unilateral Lat Isolation', 'back'],
    ['Rear Delt Isolation', 'shoulders'],
    ['Triceps Long Head Stretch', 'arms'],
    ['Triceps Lateral / Medial', 'arms'],
    ['Triceps Extension', 'arms'],
    ['Trap Hypertrophy', 'shoulders']
  ]
};

export async function seedDefaultRoutine(userId) {
  for (const [title, exs] of Object.entries(ROUTINE)) {
    const { data: w, error } = await insertWorkout({
      user_id: userId,
      title,
      notes: '3-day split default routine',
      date: new Date().toISOString().split('T')[0],
      completed: false
    });
    if (error || !w) continue;
    for (let i = 0; i < exs.length; i++) {
      const { data: e, error: eErr } = await insertExercise({
        workout_id: w.id,
        name: exs[i][0],
        muscle_group: exs[i][1],
        order_index: i
      });
      if (!e || eErr) continue;
      for (let j = 1; j <= 3; j++) {
        await insertSet({ exercise_id: e.id, set_number: j, reps: 10, weight: 0, completed: false });
      }
    }
  }
}
