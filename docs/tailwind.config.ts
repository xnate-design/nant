import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        popover: 'hsl(var(--popover))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        peony: {
          100: '#FACED2',
          200: '#F6A0AF',
          300: '#E46C8D',
          400: '#C94577',
          500: '#A6155A',
          600: '#8E0F58',
          700: '#770A54',
          800: '#60064C',
          900: '#4F0446',
        },
        croci: {
          100: '#FFF4D5',
          200: '#FFE7AC',
          300: '#FFD582',
          400: '#FFC563',
          500: '#FFA930',
          600: '#DB8723',
          700: '#B76718',
          800: '#934C0F',
          900: '#7A3809',
        },
      },
      gridTemplateColumns: {
        56: 'repeat(auto-fill, minmax(56px, 1fr))',
      },
    },
  },
  plugins: [],
};
export default config;
