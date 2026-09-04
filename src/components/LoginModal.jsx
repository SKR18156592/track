import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import EmailAuth from './EmailAuth';
import PhoneAuth from './PhoneAuth';

export default function LoginModal() {
  const [method, setMethod] = useState('email');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-iron-bg p-4">
      <div className="card w-full max-w-sm text-center">
        <Dumbbell className="mx-auto h-12 w-12 text-neon-cyan" />
        <h1 className="mb-2 text-2xl font-extrabold text-neon-cyan">⚡ IronTrack</h1>
        <p className="mb-6 text-sm text-slate-400">Track your lifts and sync across every device.</p>

        {method === 'email' ? <EmailAuth /> : <PhoneAuth />}

        <button
          onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
          className="mt-4 text-xs text-neon-cyan hover:underline"
        >
          {method === 'email' ? 'Use phone number instead' : 'Use email instead'}
        </button>
      </div>
    </div>
  );
}
