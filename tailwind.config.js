/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F9F6F0',
          subtle: '#F3EFE6',
        },
        'stone-base': {
          DEFAULT: '#E5DFC5',
          hover: '#D8CFB0',
        },
        terracotta: {
          DEFAULT: '#D9531E',
          dark: '#B83E10',
          glow: 'rgba(217, 83, 30, 0.25)',
        },
        indigo: '#2B4C7E',
        saffron: '#E08D3C',
        gold: '#C5A059',
        ink: {
          DEFAULT: '#1A202C',
          muted: '#718096',
          subtle: '#A0AEC0',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}