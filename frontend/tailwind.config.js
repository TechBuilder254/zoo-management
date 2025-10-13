/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#D1FAE5',
        },
        secondary: {
          brown: '#92400E',
          sand: '#FEF3C7',
        },
        neutral: {
          dark: '#1F2937',
          medium: '#6B7280',
          light: '#F9FAFB',
        },
        accent: '#3B82F6',
      },
    },
  },
  plugins: [],
}




