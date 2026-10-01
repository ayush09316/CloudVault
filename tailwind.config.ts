import type { Config } from 'tailwindcss';

const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

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
        // visual migration. New work should use the semantic tokens below.
        brand: {
          '100': '#0E7A6E',
          DEFAULT: '#0E7A6E',
        },
        red: '#D9443A',
        error: '#B3271E',
        green: '#1E8F6C',
        blue: '#3478C6',
        pink: '#C76FA8',
        orange: '#C9771D',
        light: {
          '100': '#3A4246',
          '200': '#7C878A',
          '300': '#E6EAE9',
          '400': '#F5F7F6',
        },
        dark: {
          '100': '#07110F',
          '200': '#121816',
        },

        vault: {
          '50': '#EDFBF6',
          '100': '#D2F4E9',
          '200': '#A6E9D3',
          '300': '#70D8B9',
          '400': '#3BBE9C',
          '500': '#199E7F',
          '600': '#0E7A6E',
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
          amber: '#C9771D',
          rose: '#D5544A',
        },

        background: token('background'),
        foreground: token('foreground'),
        surface: {
          DEFAULT: token('surface'),
          raised: token('surface-raised'),
          sunken: token('surface-sunken'),
        },
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
          hover: token('primary-hover'),
          soft: token('primary-soft'),
          text: token('primary-text'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        subtle: token('subtle-foreground'),
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        destructive: {
          DEFAULT: token('destructive'),
          foreground: token('destructive-foreground'),
          soft: token('destructive-soft'),
          text: token('destructive-text'),
        },
        success: {
          DEFAULT: token('success'),
          foreground: token('success-foreground'),
          soft: token('success-soft'),
          text: token('success-text'),
        },
        warning: {
          DEFAULT: token('warning'),
          foreground: token('warning-foreground'),
          soft: token('warning-soft'),
          text: token('warning-text'),
        },
        info: {
          DEFAULT: token('info'),
          foreground: token('info-foreground'),
          soft: token('info-soft'),
          text: token('info-text'),
        },
        border: {
          DEFAULT: token('border'),
          strong: token('border-strong'),
        },
        input: token('input'),
        ring: token('ring'),
        overlay: token('overlay'),
        chart: {
          '1': token('chart-1'),
          '2': token('chart-2'),
          '3': token('chart-3'),
          '4': token('chart-4'),
          '5': token('chart-5'),
        },
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['var(--font-geist-sans)', 'ui-sans-serif', 'sans-serif'],
        mono: [
          'var(--font-geist-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
        poppins: ['var(--font-geist-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        display: [
          '3.75rem',
          { lineHeight: '1.04', letterSpacing: '-0.045em', fontWeight: '600' },
        ],
        'display-sm': [
          '2.75rem',
          { lineHeight: '1.08', letterSpacing: '-0.04em', fontWeight: '600' },
        ],
        h1: [
          '2rem',
          { lineHeight: '1.2', letterSpacing: '-0.032em', fontWeight: '600' },
        ],
        h2: [
          '1.5rem',
          { lineHeight: '1.3', letterSpacing: '-0.024em', fontWeight: '600' },
        ],
        h3: [
          '1.25rem',
          { lineHeight: '1.4', letterSpacing: '-0.018em', fontWeight: '600' },
        ],
        h4: [
          '1.125rem',
          { lineHeight: '1.4', letterSpacing: '-0.012em', fontWeight: '600' },
        ],
        h5: [
          '1rem',
          { lineHeight: '1.5', letterSpacing: '-0.006em', fontWeight: '600' },
        ],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['0.9375rem', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.33', fontWeight: '400' }],
        overline: [
          '0.6875rem',
          { lineHeight: '1rem', letterSpacing: '0.06em', fontWeight: '500' },
        ],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        popover: 'var(--shadow-popover)',
        modal: 'var(--shadow-modal)',
        'inset-hairline': 'inset 0 0 0 1px hsl(var(--border))',
        'drop-1': 'var(--shadow-md)',
        'drop-2': 'var(--shadow-lg)',
        'drop-3': 'var(--shadow-md)',
        soft: 'var(--shadow-sm)',
        'soft-lg': 'var(--shadow-lg)',
        'ring-vault': '0 0 0 3px hsl(var(--ring) / 0.2)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        emphasized: 'var(--ease-emphasized)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'palette-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, 0) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
        },
        'palette-out': {
          '0%': { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, 0) scale(0.98)' },
        },
        'toast-progress': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        shimmer: 'shimmer 1.6s var(--ease-in-out) infinite',
        'palette-in': 'palette-in 180ms var(--ease-out) both',
        'palette-out': 'palette-out 120ms var(--ease-in-out) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
