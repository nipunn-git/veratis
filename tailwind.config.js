/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        souma: {
          bg: '#141e17',        // Hero deep forest moss green
          nav: '#243427',       // Floating pill navbar
          card: '#1e2b21',      // Dark card surface
          bone: '#f5f4ef',      // Warm bone off-white
          boneCard: '#f8f9f2',  // Light bone card
          boneBorder: '#e5e7dc', // Light bone border
          darkText: '#111b14',  // Deep forest charcoal text
          mutedDark: '#505d52', // Muted text on light bg
          sage: '#9db2a1',      // Muted sage text on dark bg
          dimSage: '#697a6d',   // Subdued green text
          accent: '#d5ed9a',    // Soft lime chartreuse accent
          border: '#2a3b2e',    // Subtle dark border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
