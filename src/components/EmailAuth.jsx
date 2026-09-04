import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function EmailAuth() {
  const {
    signInWithEmailOtp,
    signInWithPassword,
    signUpWithPassword
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('magic'); // 'magic' | 'password'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendMagicLink = async () => {
    setLoading(true); setError(''); setMessage('');
    const { error: err } = await signInWithEmailOtp(email);
    setLoading(false);
    if (err) setError(err.message);
    else setMessage('Check your email for the login link. Open it to sign in.');
  };

  const signIn = async () => {
    setLoading(true); setError(''); setMessage('');
    const { error: err } = await signInWithPassword(email, password);
    setLoading(false);
    if (err) setError(err.message);
  };

  const signUp = async () => {
    setLoading(true); setError(''); setMessage('');
    const { error: err } = await signUpWithPassword(email, password);
    setLoading(false);
    if (err) setError(err.message);
    else setMessage('Account created. Confirm your email if required, then sign in.');
  };

  return (
    <div className="flex flex-col gap-3 text-left">
      <input
        type="email"
        className="input-iron"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {mode === 'password' && (
        <input
          type="password"
          className="input-iron"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {mode === 'magic' ? (
        <button
          onClick={sendMagicLink}
          disabled={loading}
          className="btn-neon w-full"
        >
          {loading ? 'Sending…' : 'Send login link'}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <button onClick={signIn} disabled={loading} className="btn-neon w-full">
            {loading ? 'Signing in…' : 'Sign in with password'}
          </button>
          <button onClick={signUp} disabled={loading} className="btn-lime w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { setMode(mode === 'magic' ? 'password' : 'magic'); setError(''); setMessage(''); }}
          className="text-xs text-neon-cyan hover:underline"
        >
          {mode === 'magic' ? 'Use email + password instead' : 'Use magic link instead'}
        </button>
      </div>

      {message && <p className="text-center text-xs text-neon-lime">{message}</p>}
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
