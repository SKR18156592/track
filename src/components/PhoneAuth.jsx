import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function PhoneAuth() {
  const { signInWithPhoneOtp, verifyPhoneOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    setLoading(true); setError('');
    const { error: err } = await signInWithPhoneOtp(phone);
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

  const verify = async () => {
    setLoading(true); setError('');
    const { error: err } = await verifyPhoneOtp(phone, token);
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div className="flex flex-col gap-3 text-left">
      {!sent ? (
        <>
          <input
            type="tel"
            className="input-iron"
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={send} disabled={loading} className="btn-neon w-full">
            {loading ? 'Sending…' : 'Send SMS code'}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            inputMode="numeric"
            className="input-iron"
            placeholder="123456"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={verify} disabled={loading} className="btn-neon w-full">
            {loading ? 'Verifying…' : 'Verify code'}
          </button>
          <button onClick={send} className="text-xs text-neon-cyan hover:underline">
            Resend code
          </button>
        </>
      )}
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
