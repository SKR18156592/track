import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import * as db from '../stores/db';

export function useSyncWorkouts(userId) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) { setWorkouts([]); setLoading(false); return; }
    setLoading(true); setError(null);
    try { setWorkouts(await db.getWorkouts(userId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!userId) return;
    const channels = ['workouts', 'exercises', 'sets'].map((table) =>
      supabase
        .channel(`public:${table}:${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, load)
        .subscribe()
    );
    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, [userId, load]);

  const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const patch = (action, update) => {
    update();
    action().catch((e) => { setError(e.message); load(); });
  };

  const modW = (id, fn) => setWorkouts((ws) => ws.map((w) => w.id === id ? fn(w) : w));
  const modE = (eid, fn) => setWorkouts((ws) => ws.map((w) => ({
    ...w,
    exercises: w.exercises.map((e) => e.id === eid ? fn(e) : e).filter(Boolean)
  })));
  const modS = (sid, fn) => setWorkouts((ws) => ws.map((w) => ({
    ...w,
    exercises: w.exercises.map((e) => ({
      ...e,
      sets: e.sets.map((s) => s.id === sid ? fn(s) : s).filter(Boolean)
    }))
  })));

  return {
    workouts, loading, error, refetch: load,
    addWorkout: (w) => patch(
      () => db.insertWorkout({ ...w, user_id: userId }),
      () => setWorkouts((ws) => [{ ...w, id: uuid(), user_id: userId, exercises: [] }, ...ws])
    ),
    saveWorkout: (id, u) => patch(() => db.updateWorkout(id, u), () => modW(id, (w) => ({ ...w, ...u }))),
    removeWorkout: (id) => patch(() => db.deleteWorkout(id), () => setWorkouts((ws) => ws.filter((w) => w.id !== id))),
    addExercise: (wid, e) => patch(
      () => db.insertExercise({ ...e, workout_id: wid }),
      () => modW(wid, (w) => ({ ...w, exercises: [...w.exercises, { ...e, id: uuid(), workout_id: wid, sets: [] }] }))
    ),
    saveExercise: (id, u) => patch(() => db.updateExercise(id, u), () => modE(id, (e) => ({ ...e, ...u }))),
    removeExercise: (id) => patch(() => db.deleteExercise(id), () => modE(id, () => null)),
    addSet: (eid, s) => patch(
      () => db.insertSet({ ...s, exercise_id: eid }),
      () => modE(eid, (e) => ({ ...e, sets: [...e.sets, { ...s, id: uuid(), exercise_id: eid }] }))
    ),
    saveSet: (id, u) => patch(() => db.updateSet(id, u), () => modS(id, (s) => ({ ...s, ...u }))),
    removeSet: (id) => patch(() => db.deleteSet(id), () => modS(id, () => null))
  };
}
