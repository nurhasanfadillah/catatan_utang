import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.ts',
    './services/**/*.ts',
    './utils/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
