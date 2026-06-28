/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Satoshi"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0F0F10',
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
        },
        bone: {
          DEFAULT: '#F5F1E8',
          50: '#FAF7EF',
          100: '#F5F1E8',
          200: '#E8E2D2',
        },
        modo: {
          // Brand palette
          orange: '#E8541A',   // Primary CTA
          yellow: '#F2B705',   // Accent / highlight
          teal:   '#0E7C7B',   // Secondary
          charcoal: '#1A1A1D', // Dark surface
          paper:   '#FBF9F4',  // Light surface
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 30s linear infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
}
