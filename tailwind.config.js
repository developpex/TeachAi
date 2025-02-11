/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1B3A1D', // darkest green
        'primary': '#2D5A30', // dark green
        'background': '#F5F2E9', // light cream
        'accent': '#FF7D00', // orange
        'accent-dark': '#E86A00', // dark orange
        'mint': '#90B77D', // light green
        'sage': '#42855B', // medium green
        'coral': '#FFA559', // light orange
        'cream': '#F5F2E9', // light cream
        'sky': '#C5E898', // light sage
        'sand': '#FFE5D0', // light peach
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(27, 58, 29, 0.08)',
      },
    },
  },
  plugins: [],
};