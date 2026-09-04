import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Workbox } from 'workbox-window';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.addEventListener('waiting', () => {
    if (confirm('A new version of IronTrack is available. Reload to update?')) {
      wb.messageSkipWaiting();
      window.location.reload();
    }
  });
  wb.register().catch(console.error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
