import { useAuth } from '../AuthContext';
import { User, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="card flex flex-col gap-4">
      <h2 className="text-lg font-bold text-neon-cyan">Settings</h2>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-cyan/10 text-neon-cyan">
          <User className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100">{user?.email || user?.phone || 'Athlete'}</div>
          <div className="text-xs text-slate-400">Unit: {profile?.unit || 'kg'}</div>
        </div>
      </div>

      <button onClick={signOut} className="btn-magenta w-full">
        <LogOut className="h-4 w-4" /> Sign out
      </button>

      <p className="text-xs text-slate-500">
        Add this app to your home screen for the best PWA experience.
      </p>
    </div>
  );
}
