/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutalist: {
          gray: '#202020',
          lightgray: '#e0e0e0',
          accent: '#ff6b6b',
          secondary: '#4ecdc4',
          dark: '#111111',
        },
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
} 