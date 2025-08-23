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
        // Add standard Tailwind colors
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}