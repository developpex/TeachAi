/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1B3A1D',
        'primary': '#2D5A30',
        'background': '#F5F2E9',
        'accent': '#FF7D00',
        'accent-dark': '#E86A00',
        'mint': '#90B77D',
        'sage': '#42855B',
        'coral': '#FFA559',
        'cream': '#F5F2E9',
        'sky': '#C5E898',
        'sand': '#FFE5D0',

        // Dark mode colors
        dark: {
          'primary': '#151923', // Darker shade for navigation
          'primary-dark': '#0A1F0B',
          'background': '#111827',
          'surface': '#1F2937',
          'text': '#F3F4F6',
          'text-secondary': '#9CA3AF',
          'border': '#374151',
          'nav': '#1a1f2c'  // Slightly lighter than primary for content areas
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(27, 58, 29, 0.08)',
        'dark-soft': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};