/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rpg-bg': '#1a1a1a',
        'rpg-panel': '#2a2a2a',
        'rpg-text': '#e0e0e0',
        'rpg-accent': '#d4af37', // Gold
      },
    },
  },
  plugins: [],
}
