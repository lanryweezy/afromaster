/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      colors: {
        // Custom colors that can be controlled by CSS variables
        primary: {
          DEFAULT: 'var(--color-primary, #f97316)', 
          focus: 'var(--color-primary-focus, #fb923c)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #dc2626)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #fde047)',
        },
        'gradient-from': 'var(--gradient-from, #7f1d1d)',
        'gradient-to': 'var(--gradient-to, #854d0e)',
        'gradient-via': 'var(--gradient-via, #030712)',
      }
    },
  },
  plugins: [],
}