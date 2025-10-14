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
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.813rem',    // 13px
        'base': '0.875rem',  // 14px (matching sidebar)
        'lg': '1rem',        // 16px
        'xl': '1.125rem',    // 18px
        '2xl': '1.375rem',   // 22px
        '3xl': '1.75rem',    // 28px
        '4xl': '2rem',       // 32px
        '5xl': '2.25rem',    // 36px
      },
      spacing: {
        '0': '0',
        '1': '0.25rem',      // 4px
        '2': '0.5rem',       // 8px
        '3': '0.75rem',      // 12px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '8': '2rem',         // 32px
        '10': '2.5rem',      // 40px
        '12': '3rem',        // 48px
      }
    },
  },
  plugins: [],
}





