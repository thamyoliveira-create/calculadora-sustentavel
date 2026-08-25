/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          950: '#032820',
          900: '#064234',
          800: '#0b5645',
          700: '#116b56',
          100: '#d1fae5',
          50: '#ecfdf5',
        },
        gold: {
          500: '#D7A524',
          400: '#E5B83B',
          300: '#F3CE63',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
      },
    },
  },
  plugins: [],
};
