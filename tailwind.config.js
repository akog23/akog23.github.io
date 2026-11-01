/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  // Classes built dynamically in main.js (`from-${accent}/10` etc.) must be listed here.
  safelist: [
    { pattern: /(from|bg|border|text)-(primary|tertiary)(\/(10|20|30))?/ },
    { pattern: /border-(primary|tertiary)\/30/, variants: ['group-hover'] },
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FB7185",   // sakura rose
        secondary: "#0B0D12", // background
        tertiary: "#FBBF24",  // amber accent
        neutral: "#D4D4D8",
      },
      fontFamily: {
        heading: ["'Sora'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #FBBF2426 0deg, #FB718533 180deg, #FBBF2426 360deg)',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(251,113,133,0.15)',
        'glow-sm': '0 0 15px rgba(251,113,133,0.25)',
        'glow-lg': '0 0 24px rgba(251,113,133,0.45)',
        'glow-amber': '0 0 15px rgba(251,191,36,0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'blink': 'blink 1s steps(1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
