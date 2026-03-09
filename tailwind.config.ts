import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#071224',
        card: '#0f223c',
        accent: '#ff6a3d',
        calm: '#35b3ff'
      },
      backgroundImage: {
        water: 'linear-gradient(160deg, #0b1e37 0%, #11335c 45%, #0e253f 100%)'
      }
    }
  },
  plugins: []
};

export default config;
