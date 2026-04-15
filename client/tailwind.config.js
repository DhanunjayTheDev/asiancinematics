/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd4fe',
          300: '#8ebbfd',
          400: '#5997fa',
          500: '#3478f6',
          600: '#0071e3',
          700: '#005bb5',
          800: '#064e96',
          900: '#0a4076',
          950: '#072a4e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
