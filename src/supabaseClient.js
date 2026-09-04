import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    '[IronTrack] Supabase URL or anon key is missing. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file. ' +
    'Auth and sync will not work until these are configured.'
  );
}

// Use placeholders only so the app can render when env is missing during dev/preview.
// Replace with your real Supabase values in .env before deploying.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-anon-key'
);
