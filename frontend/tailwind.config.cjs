/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '16px',
      },
    },
  },
  plugins: [],
};
