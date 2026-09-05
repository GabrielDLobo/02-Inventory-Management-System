/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Claro (telas internas)
        bg: '#F7F9FC',
        surface: { DEFAULT: '#FFFFFF', 2: '#FBFCFE' },
        ink: '#0B1220',
        muted: '#5B6472',
        line: { DEFAULT: '#E6EAF0', 2: '#EFF2F7' },
        // Marca / acento
        cyan: { DEFAULT: '#22D3EE', 600: '#06B6D4', 700: '#0E7490' },
        human: '#FF9E7A',
        violet: '#7C6FF0',
        // Semânticos (sempre com ícone/label, nunca cor sozinha)
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#F43F5E',
        // Dark (login, hero, headers 3D)
        dark: { DEFAULT: '#04070D', 2: '#0A0F1A', line: '#16202E' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(11,18,32,.05)',
        card: '0 1px 2px rgba(11,18,32,.05)',
        glow: '0 0 24px rgba(34,211,238,.45)',
      },
    },
  },
  plugins: [],
}
