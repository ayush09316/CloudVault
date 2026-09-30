import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy tokens kept so existing components/tests referencing them
        // (e.g. text-light-100, bg-dark-200) keep working during the
        // visual migration — new work should prefer the vault/ink scale.
        brand: {
          '100': '#0E7A6E',
          DEFAULT: '#0E7A6E',
        },
        red: '#E8604C',
        error: '#b3271e',
        green: '#1FAE85',
        blue: '#3E8FD6',
        pink: '#D98CC2',
        orange: '#E0994F',
        light: {
          '100': '#3A4046',
          '200': '#8D9AA0',
          '300': '#EEF2F1',
          '400': '#F4F6F5',
        },
        dark: {
          '100': '#07110F',
          '200': '#101B19',
        },

        // CloudVault design system — a deep "vault" teal paired with a
        // warm-neutral ink scale and a signal amber for quota/attention
        // states. This is the source of truth for new UI.
        vault: {
          '50': '#EDFBF6',
          '100': '#D2F4E9',
          '200': '#A6E9D3',
          '300': '#70D8B9',
          '400': '#3BBE9C',
          '500': '#199E7F',
          '600': '#0E7A6E', // primary brand
          '700': '#0C5F58',
          '800': '#0D4A46',
          '900': '#0B3B38',
          '950': '#052220',
          DEFAULT: '#0E7A6E',
        },
        ink: {
          '0': '#FFFFFF',
          '50': '#F6F7F7',
          '100': '#ECEEEE',
          '200': '#D7DBDB',
          '300': '#B4BBBB',
          '400': '#8A9392',
          '500': '#677170',
          '600': '#4C5453',
          '700': '#383F3E',
          '800': '#222726',
          '900': '#151918',
          '950': '#0A0D0C',
        },
        signal: {
          amber: '#D98F2B',
          rose: '#D5544A',
        },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        display: ['var(--font-manrope)', 'var(--font-poppins)', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-poppins)', 'sans-serif'],
      },
      fontSize: {
        display: ['4rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['2.125rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
        h4: ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        h5: ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['0.9375rem', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.45', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
        overline: ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'drop-1': '0px 10px 30px 0px rgba(66, 71, 97, 0.1)',
        'drop-2': '0 8px 30px 0 rgba(65, 89, 214, 0.3)',
        'drop-3': '0 8px 30px 0 rgba(65, 89, 214, 0.1)',
        soft: '0 1px 2px rgba(10, 13, 12, 0.04), 0 8px 24px -12px rgba(10, 13, 12, 0.12)',
        'soft-lg': '0 2px 4px rgba(10, 13, 12, 0.04), 0 24px 48px -16px rgba(10, 13, 12, 0.18)',
        'ring-vault': '0 0 0 3px rgba(14, 122, 110, 0.18)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 12px)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
