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

        // Property237 brand colors
        'property237-primary': '#1ed266',
        'background-light': '#f6f8f7',
        'background-dark': '#112117',

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
        'property-featured': '#ff6b35',
        'property-premium': '#f7b801',
        'visitation-pass': '#00d4aa',
        'escrow': '#6366f1',
      },
      fontFamily: {
        ...typography.fontFamily,
        'display': ['Manrope', 'system-ui', 'sans-serif'],
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