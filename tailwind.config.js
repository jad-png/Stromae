/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c4ff',
          300: '#a5a0ff',
          400: '#8b7fff',
          500: '#7c5cfc',
          600: '#6d3ef2',
          700: '#5e2fd6',
          800: '#4d27ae',
          900: '#40238a',
          950: '#261455',
        },
        accent: {
          50: '#fff0f7',
          100: '#ffe0f0',
          200: '#ffc6e3',
          300: '#ff9ccc',
          400: '#ff60a8',
          500: '#ff2d87',
          600: '#f00a63',
          700: '#d1004f',
          800: '#ad0444',
          900: '#8f093c',
          950: '#58001f',
        },
        ocean: {
          50: '#edfffe',
          100: '#d1fffe',
          200: '#a9feff',
          300: '#6bfcff',
          400: '#24f2f8',
          500: '#08d5de',
          600: '#0aabbb',
          700: '#108897',
          800: '#166c7a',
          900: '#175a67',
          950: '#083c47',
        },
        sunset: {
          50: '#fff8ed',
          100: '#ffeed4',
          200: '#ffd9a8',
          300: '#ffbe71',
          400: '#ff9738',
          500: '#fe7a11',
          600: '#ef5f07',
          700: '#c64608',
          800: '#9d380f',
          900: '#7e3010',
          950: '#441506',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #7c5cfc 0%, #ff2d87 50%, #08d5de 100%)',
        'card-gradient':
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(124, 92, 252, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 45, 135, 0.3)',
        'glow-ocean': '0 0 20px rgba(8, 213, 222, 0.3)',
      },
    },
  },
  plugins: [],
};
