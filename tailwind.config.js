/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/templates/**/*.html',
    './*/templates/**/*.html',
  ],
  safelist: [
    // Semantic quantity/stock badges built with dynamic Tailwind classes in Django templates
    { pattern: /^(bg|text|border)-(green|yellow|red|sky|purple)-(300|400|500)\/?(20|30)?$/ },
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0f1c',
          900: '#0d1b2e',
          800: '#111e33',
          700: '#223049',
          600: '#2c3d5c',
        },
        ice: '#f1f5f9',
        mist: {
          DEFAULT: '#8b98ae',
          dim: '#5c6883',
        },
        lucro: '#22c55e',
        saida: '#f5495f',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        control: '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
