import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    const handler = (e) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = () => {
    if (!prompt) return;
    prompt.prompt();
    setPrompt(null);
  };

  if (dismissed) return null;
  if (!prompt && !isIOS) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 card shadow-[0_0_24px_rgba(0,243,255,0.15)]">
      <div className="flex items-center justify-between gap-3">
        {isIOS ? (
          <p className="text-sm text-slate-100">
            Install IronTrack: tap the <strong>Share</strong> button, then <strong>Add to Home Screen</strong>.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Download className="h-4 w-4 text-neon-cyan" />
              Install IronTrack?
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={install} className="btn-neon py-2 px-3 text-xs">Install</button>
            </div>
          </>
        )}
        <button onClick={() => setDismissed(true)} className="rounded p-1 text-slate-400 hover:text-slate-200">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
