/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./view/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background-login': "url('/view/src/assets/HINH3-upwebgiamDL.jpg')"
      },
      screens: {
        '3xl': '1600px',
        'xlp': '1320px',
        'xix': '900px',
        '525': '525px',
      },
      zIndex: {
        '100': '100',
        '999': '999',
      },
      colors: {
        'red-system': "#B80011",
        'red-system-hover': "#C23C48",
      }
    },
  },
  colors: {
    'system': "#306BA0",
  },
  plugins: [],
}