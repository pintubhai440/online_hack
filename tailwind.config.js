/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal - Represents growth & money (ROI/Loans)
          600: '#0d9488',
          900: '#134e4a',
        },
        primary: {
          50: '#eef2ff',
          500: '#6366f1', // Indigo - Represents Education & Trust
          600: '#4f46e5',
          900: '#312e81',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ekdum clean aur professional font
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)', // Modern soft shadow
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      }
    },
  },
  plugins: [],
};
