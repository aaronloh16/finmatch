/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFCF7',
        'cream-dark': '#F7F1E8',
        sage: {
          50: '#F4F7F4',
          100: '#E3EBE3',
          200: '#C1D6C1',
          300: '#96B896',
          400: '#6B9A6B',
          500: '#4F7A4F',
          600: '#3E613E',
          700: '#2F4A2F',
          800: '#213421',
          900: '#141F14',
        },
        coral: {
          50: '#FEF3F0',
          100: '#FDE4DD',
          200: '#FAC5B8',
          300: '#F5A08A',
          400: '#EF7B65',
          500: '#D4644D',
          600: '#B54A35',
          700: '#8C3826',
          800: '#632618',
          900: '#3D170F',
        },
        warm: {
          50: '#FEFCF8',
          100: '#FBF6EE',
          200: '#F0E6D3',
          300: '#E0CEB0',
          400: '#C8AB80',
          500: '#A68A5B',
          600: '#7D6840',
        },
        forest: {
          50: '#F2F5F2',
          100: '#E0E8E0',
          200: '#B8CEB8',
          300: '#8DB48D',
          400: '#5C8F5C',
          500: '#3D6E3D',
          600: '#2D522D',
          700: '#1F3A1F',
          800: '#142514',
          900: '#0B150B',
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(20, 15, 10, 0.04), 0 8px 32px rgba(20, 15, 10, 0.06)',
        'card-hover': '0 2px 6px rgba(20, 15, 10, 0.06), 0 20px 60px rgba(20, 15, 10, 0.10)',
        'float': '0 1px 2px rgba(20, 15, 10, 0.03), 0 4px 16px rgba(20, 15, 10, 0.04)',
        'glow': '0 0 20px rgba(79, 122, 79, 0.15), 0 0 60px rgba(79, 122, 79, 0.05)',
        'glow-coral': '0 0 20px rgba(212, 100, 77, 0.15), 0 0 60px rgba(212, 100, 77, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}
