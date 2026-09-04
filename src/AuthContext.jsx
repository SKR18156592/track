import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (uid) => {
    if (!uid) { setProfile(null); return; }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (error) {
      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .insert({ id: uid, username: user?.email || user?.phone })
        .select().single();
      if (!insertErr) setProfile(inserted);
    } else {
      setProfile(data);
    }
  }, [user?.email, user?.phone]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) refreshProfile(session.user.id);
    }).finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) refreshProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => data.subscription.unsubscribe();
  }, [refreshProfile]);

  const signInWithEmailOtp = (email) => supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/` }
  });

  const signInWithPhoneOtp = (phone) => supabase.auth.signInWithOtp({ phone });
  const verifyPhoneOtp = (phone, token) => supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  const signInWithPassword = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUpWithPassword = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{
      user, profile, loading, refreshProfile,
      signInWithEmailOtp, signInWithPhoneOtp, verifyPhoneOtp,
      signInWithPassword, signUpWithPassword, signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
