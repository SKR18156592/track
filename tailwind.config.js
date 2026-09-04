/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        iron: { bg: '#0a0a0f', panel: '#12141e', card: '#181a2a', border: 'rgba(255,255,255,0.09)' },
        neon: { cyan: '#00f3ff', lime: '#39ff14', magenta: '#ff007f' }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
