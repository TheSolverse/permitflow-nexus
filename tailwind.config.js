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
        mh: {
          navy: '#0A192F',
          saffron: '#FF9933',
          saffronDark: '#D97706',
          green: '#10B981',
          blue: '#1E3A8A',
          lightBg: '#F8FAFC',
          cardBg: '#FFFFFF',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
