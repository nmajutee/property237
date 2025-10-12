/** @type {import('tailwindcss').Config} */
const colors = require('./src/design-system/tokens/colors.json');
const typography = require('./src/design-system/tokens/typography.json');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map design tokens to Tailwind
        primary: colors.colors.primary,
        secondary: colors.colors.secondary,
        accent: colors.colors.accent,
        neutral: colors.colors.neutral,
        success: colors.colors.success,
        warning: colors.colors.warning,
        error: colors.colors.error,
        cameroon: colors.cameroon,

        // Property237 brand colors (Professional Green Scheme - Growth & Trust)
        'property237-primary': '#059669',    // Emerald 600 - Growth, Trust, Professionalism
        'property237-primary-light': '#10B981', // Emerald 500 - Bright, energetic
        'property237-primary-dark': '#047857',  // Emerald 700 - Deep, stable hover
        'property237-primary-darker': '#065F46', // Emerald 800 - Rich, premium
        'property237-secondary': '#14B8A6',  // Teal 500 - Fresh, modern complement
        'property237-secondary-light': '#2DD4BF', // Teal 400 - Vibrant
        'property237-secondary-dark': '#0D9488',  // Teal 600 - Sophisticated
        'property237-accent': '#F59E0B',     // Amber 500 - Warmth, Luxury, CTAs
        'property237-accent-dark': '#D97706', // Amber 600 - Rich hover
        'property237-dark': '#111827',       // Gray 900 - Dark background
        'property237-light': '#F9FAFB',      // Gray 50 - Light background
        'background-light': '#F9FAFB',
        'background-dark': '#111827',

        // Theme-aware colors (CSS variables)
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',

        // Property-specific colors
        'property-featured': '#F59E0B',      // Amber 500 - Featured listings
        'property-premium': '#14B8A6',       // Teal 500 - Premium properties
        'property-available': '#10B981',     // Emerald 500 - Available status
        'property-success': '#10B981',       // Emerald 500 - Success states
        'property-urgent': '#DC2626',        // Red 600 - Urgent CTAs only
        'visitation-pass': '#14B8A6',        // Teal 500 - Visitation features
        'escrow': '#6366f1',                 // Indigo 500 - Escrow/financial

        // Semantic colors (keeping existing + adding green variants)
        'emerald': {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        'teal': {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
      },
      fontFamily: {
        ...typography.fontFamily,
        // Craftwork Grotesk - For headings, titles, buttons (geometric, bold)
        'display': ['var(--font-craftwork-grotesk)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-craftwork-grotesk)', 'Craftwork Grotesk', 'system-ui', 'sans-serif'],

        // DM Sans - For body text, descriptions (humanist, readable)
        'sans': ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
        '5xl': ['3rem', { lineHeight: '1', fontWeight: '800' }],
        '6xl': ['3.75rem', { lineHeight: '1', fontWeight: '800' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      fontSize: typography.fontSize,
      borderRadius: typography.borderRadius,
      spacing: typography.spacing,

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
      },

      // Grid & layout utilities
      gridTemplateColumns: {
        'property-grid': 'repeat(auto-fill, minmax(300px, 1fr))',
        'admin-layout': '250px 1fr',
        'chat-layout': '300px 1fr 250px',
      },

      // Responsive design
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),

    // Custom utility plugins
    function({ addUtilities, theme }) {
      addUtilities({
        '.glass': {
          'background-color': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-dark': {
          'background-color': 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.property-shadow': {
          'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        '.property-shadow-lg': {
          'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });
    },
  ],
};