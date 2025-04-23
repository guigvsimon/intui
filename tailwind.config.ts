import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // ou 'media', se preferir automático
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // ← App Router usa também .mdx às vezes
  ],
  theme: {
    extend: {
      colors: {
        intui: {
          primary: '#2D81F7',
          light: '#E3F0FF',
          dark: '#171717',
          bg: '#FFFFFF',
          bgDark: '#0A0A0A',
          textLight: '#EDEDED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // opcional
      },
    },
  },
  plugins: [],
}

export default config
