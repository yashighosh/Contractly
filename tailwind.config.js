/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Brand Tokens ── */
        brand: {
          navy: {
            900: '#0F1A2E',
            800: '#162338',
            700: '#1E3250',
            600: '#2E3C52',
          },
          gold: {
            500: '#C9A84C',
            400: '#D4B567',
            300: '#E8C97A',
            100: '#FDF6E3',
          },
          emerald: {
            600: '#0A7A5F',
            500: '#0E9470',
            400: '#12B589',
            100: '#E6F7F3',
          },
        },
        /* ── Semantic Tokens (light default, dark via CSS vars) ── */
        'bg-page':      'var(--bg-page)',
        'bg-primary':   'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'fg-primary':   'var(--fg-primary)',
        'fg-secondary': 'var(--fg-secondary)',
        'border-col':   'var(--border-default)',
        'gold':         'var(--accent-gold)',
        'em':           'var(--accent-emerald)',
        /* ── Status semantic ── */
        semantic: {
          success: { DEFAULT: '#0E9470', light: '#E6F7F3' },
          warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
          danger:  { DEFAULT: '#EF4444', light: '#FEE2E2' },
          info:    { DEFAULT: '#3B82F6', light: '#DBEAFE' },
        },
        /* ── Keep original brand colors ── */
        brand2: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
      },
      fontFamily: {
        serif:  ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        sans:   ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono:   ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(15,26,46,0.06), 0 4px 12px rgba(15,26,46,0.04)',
        'card-lg': '0 4px 24px rgba(15,26,46,0.10), 0 1px 4px rgba(15,26,46,0.06)',
        'gold':    '0 4px 14px rgba(201,168,76,0.25)',
        'gold-lg': '0 8px 24px rgba(201,168,76,0.35)',
        'glass':   '0 8px 32px rgba(15,26,46,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'shimmer':     'shimmer 1.6s infinite',
        'pulse-dot':   'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.22s ease-out',
        'ring-spin':   'spin 1s linear infinite',
        'count-up':    'countUp 0.8s ease-out forwards',
        'stamp-drop':  'stampDrop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        countUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        stampDrop: {
          '0%':   { opacity: 0, transform: 'scale(0.5) rotate(-12deg)' },
          '70%':  { transform: 'scale(1.05) rotate(2deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionProperty: {
        'theme': 'background-color, color, border-color, fill, stroke',
      },
    },
  },
  plugins: [],
};
