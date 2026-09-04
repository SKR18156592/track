import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { useSyncWorkouts } from './hooks/useSyncWorkouts';
import LoginModal from './components/LoginModal';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import Settings from './components/Settings';

function Shell() {
  const { user, loading, signOut } = useAuth();
  const sync = useSyncWorkouts(user?.id);
  const [view, setView] = useState('workouts');
  const [detailId, setDetailId] = useState(null);

  if (loading) return <p className="p-8 text-center text-neon-cyan">Loading…</p>;
  if (!user) return <LoginModal />;

  const w = sync.workouts.find((x) => x.id === detailId);
  const addW = () => sync.addWorkout({
    title: 'New Workout',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    completed: false
  });

  return (
    <div className="min-h-screen bg-iron-bg text-slate-100 pb-28">
      <header className="sticky top-0 z-40 border-b border-iron-border bg-iron-panel/90 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-neon-cyan">⚡ IronTrack</h1>
          <button onClick={signOut} className="text-sm font-bold text-neon-magenta">Sign out</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        {view === 'settings' && <Settings />}

        {view !== 'settings' && !w && (
          <WorkoutList
            workouts={view === 'history' ? sync.workouts.filter((x) => x.completed) : sync.workouts}
            onSelect={setDetailId}
            onAdd={addW}
            onDelete={sync.removeWorkout}
          />
        )}

        {w && <WorkoutDetail workout={w} onBack={() => setDetailId(null)} {...sync} />}
      </main>

      <BottomNav current={view} onChange={setView} />
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
