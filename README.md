# IronTrack PWA

A production-ready, cross-platform workout tracker built with **React 18**, **Vite 5**, **Tailwind CSS**, and **Supabase**. It is designed as a fully installable Progressive Web App (PWA) that works offline and syncs your data in real-time across iOS, Android, macOS, Windows, and Linux.

## Features

- Email magic-link / email + password authentication, plus phone-number (SMS OTP) fallback
- Real-time multi-device sync via Supabase Realtime
- Offline-first PWA with service worker and cache
- Mobile-first responsive UI with dark cyberpunk theme
- CRUD workouts, exercises, and sets
- Row-Level Security (RLS) on every table

## Project Structure

```
irontrack-pwa/
├── public/              # PWA manifest and icons
├── src/
│   ├── components/      # React UI components
│   ├── hooks/           # useSyncWorkouts realtime sync hook
│   ├── stores/          # Supabase DB helpers
│   ├── AuthContext.jsx  # Auth state and email/phone helpers
│   ├── App.jsx          # Main app shell
│   └── main.jsx         # Entry point
├── supabase/schema.sql  # Database schema + RLS + realtime
├── vite.config.js       # Vite + React
├── tailwind.config.js   # Custom iron/neon theme
└── index.html           # iOS PWA meta tags
```

## Local Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in your Supabase project URL and anon key:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Install dependencies:

```bash
npm install
```

4. Apply the database schema in the Supabase SQL Editor:

```bash
# Paste the contents of supabase/schema.sql into Supabase Dashboard → SQL Editor → New query → Run
```

5. Enable the **Email** and **Phone** providers in Supabase Auth (Authentication → Providers).
   - For email, enable **Email** and (if using magic links) set the Site URL and any redirect URLs.
   - For phone, configure an SMS provider (e.g., Twilio) and enable the provider.

6. Start the dev server:

```bash
npm run dev
```

7. Build for production:

```bash
npm run build
npm run preview
```

## PWA Installation

### iOS Safari
1. Open the deployed URL in Safari.
2. Tap the **Share** button.
3. Tap **Add to Home Screen**.

### Android Chrome
1. Open the URL in Chrome.
2. Tap the three-dot menu → **Add to Home screen**.

### Desktop Chrome/Edge
1. Open the URL.
2. Click the install icon in the address bar or the in-app **Install** banner.

## Deployment

### Vercel
1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Netlify
1. Connect the GitHub repo.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add the Supabase env vars.

### Cloudflare Pages
1. Connect the repo.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add the Supabase env vars.

### Custom domain + HTTPS
A PWA install prompt only appears on **HTTPS** with a valid manifest and service worker. After connecting a custom domain, enable HTTPS/SSL in your host dashboard (all major hosts do this automatically).

## Realtime Sync

The app subscribes to `workouts`, `exercises`, and `sets` tables via Supabase Realtime. Any edit on one device will automatically refetch and reflect on every other signed-in device.

## Notes

- The service worker is a manual Workbox-style `public/sw.js` and is registered with `workbox-window` in `src/main.jsx`.
- `manifest.webmanifest` and SVG icons live in `public/`.
- The 3-day default routine is based on the original single-file IronTrack prototype.
- Some Supabase/workbox packages may log `EBADENGINE` warnings on Node 18. The app builds and runs fine; Node 20 is recommended for production CI.
