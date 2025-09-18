/** @type {import('tailwindcss').Config} */
const tokens = require('./src/design/tokens.json');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Colors mapped from design tokens
      colors: {
        brand: {
          50: tokens.color.brand['50'],
          100: tokens.color.brand['100'],
          200: tokens.color.brand['200'],
          300: tokens.color.brand['300'],
          400: tokens.color.brand['400'],
          500: tokens.color.brand['500'],
          600: tokens.color.brand['600'],
          700: tokens.color.brand['700'],
          800: tokens.color.brand['800'],
          900: tokens.color.brand['900'],
        },
        accent: {
          50: tokens.color.accent['50'],
          100: tokens.color.accent['100'],
          200: tokens.color.accent['200'],
          300: tokens.color.accent['300'],
          400: tokens.color.accent['400'],
          500: tokens.color.accent['500'],
          600: tokens.color.accent['600'],
          700: tokens.color.accent['700'],
          800: tokens.color.accent['800'],
          900: tokens.color.accent['900'],
        },
        neutral: {
          50: tokens.color.neutral['50'],
          100: tokens.color.neutral['100'],
          200: tokens.color.neutral['200'],
          300: tokens.color.neutral['300'],
          400: tokens.color.neutral['400'],
          500: tokens.color.neutral['500'],
          600: tokens.color.neutral['600'],
          700: tokens.color.neutral['700'],
          800: tokens.color.neutral['800'],
          900: tokens.color.neutral['900'],
        },
        success: tokens.color.semantic.success,
        warning: tokens.color.semantic.warning,
        danger: tokens.color.semantic.danger,
        info: tokens.color.semantic.info,

        // CSS Variable colors for runtime theming
        surface: {
          primary: 'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
          elevated: 'var(--color-surface-elevated)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
          muted: 'var(--color-text-muted)',
        },
      },

      // Typography from tokens
      fontFamily: {
        sans: tokens.typography.fontFamily.base.split(', '),
        heading: tokens.typography.fontFamily.heading.split(', '),
        mono: tokens.typography.fontFamily.mono.split(', '),
      },
      fontSize: {
        xs: [tokens.typography.fontSize.xs, { lineHeight: tokens.typography.lineHeight.normal }],
        sm: [tokens.typography.fontSize.sm, { lineHeight: tokens.typography.lineHeight.normal }],
        base: [tokens.typography.fontSize.base, { lineHeight: tokens.typography.lineHeight.normal }],
        lg: [tokens.typography.fontSize.lg, { lineHeight: tokens.typography.lineHeight.normal }],
        xl: [tokens.typography.fontSize.xl, { lineHeight: tokens.typography.lineHeight.snug }],
        '2xl': [tokens.typography.fontSize['2xl'], { lineHeight: tokens.typography.lineHeight.snug }],
        '3xl': [tokens.typography.fontSize['3xl'], { lineHeight: tokens.typography.lineHeight.tight }],
        '4xl': [tokens.typography.fontSize['4xl'], { lineHeight: tokens.typography.lineHeight.tight }],
        '5xl': [tokens.typography.fontSize['5xl'], { lineHeight: tokens.typography.lineHeight.tight }],
        '6xl': [tokens.typography.fontSize['6xl'], { lineHeight: tokens.typography.lineHeight.tight }],
      },
      fontWeight: {
        light: tokens.typography.fontWeight.light,
        normal: tokens.typography.fontWeight.normal,
        medium: tokens.typography.fontWeight.medium,
        semibold: tokens.typography.fontWeight.semibold,
        bold: tokens.typography.fontWeight.bold,
        extrabold: tokens.typography.fontWeight.extrabold,
      },
      letterSpacing: {
        tight: tokens.typography.letterSpacing.tight,
        normal: tokens.typography.letterSpacing.normal,
        wide: tokens.typography.letterSpacing.wide,
      },

      // Spacing from tokens
      spacing: {
        0: tokens.spacing['0'],
        1: tokens.spacing['1'],
        2: tokens.spacing['2'],
        3: tokens.spacing['3'],
        4: tokens.spacing['4'],
        5: tokens.spacing['5'],
        6: tokens.spacing['6'],
        7: tokens.spacing['7'],
        8: tokens.spacing['8'],
        10: tokens.spacing['10'],
        12: tokens.spacing['12'],
        14: tokens.spacing['14'],
        16: tokens.spacing['16'],
        20: tokens.spacing['20'],
        24: tokens.spacing['24'],
        32: tokens.spacing['32'],
        40: tokens.spacing['40'],
        48: tokens.spacing['48'],
        56: tokens.spacing['56'],
        64: tokens.spacing['64'],
      },

      // Border radius from tokens
      borderRadius: {
        none: tokens.borderRadius.none,
        sm: tokens.borderRadius.sm,
        DEFAULT: tokens.borderRadius.base,
        md: tokens.borderRadius.md,
        lg: tokens.borderRadius.lg,
        xl: tokens.borderRadius.xl,
        '2xl': tokens.borderRadius['2xl'],
        '3xl': tokens.borderRadius['3xl'],
        full: tokens.borderRadius.full,
      },

      // Box shadows from tokens
      boxShadow: {
        sm: tokens.boxShadow.sm,
        DEFAULT: tokens.boxShadow.base,
        md: tokens.boxShadow.md,
        lg: tokens.boxShadow.lg,
        xl: tokens.boxShadow.xl,
        '2xl': tokens.boxShadow['2xl'],
        inner: tokens.boxShadow.inner,
      },

      // Z-index from tokens
      zIndex: {
        hide: tokens.zIndex.hide,
        auto: tokens.zIndex.auto,
        base: tokens.zIndex.base,
        docked: tokens.zIndex.docked,
        dropdown: tokens.zIndex.dropdown,
        sticky: tokens.zIndex.sticky,
        banner: tokens.zIndex.banner,
        overlay: tokens.zIndex.overlay,
        modal: tokens.zIndex.modal,
        popover: tokens.zIndex.popover,
        skipLink: tokens.zIndex.skipLink,
        toast: tokens.zIndex.toast,
        tooltip: tokens.zIndex.tooltip,
      },

      // Animation duration and easing
      transitionDuration: {
        fast: tokens.animation.duration.fast,
        normal: tokens.animation.duration.normal,
        slow: tokens.animation.duration.slow,
      },
      transitionTimingFunction: {
        ease: tokens.animation.easing.ease,
        'ease-in': tokens.animation.easing.easeIn,
        'ease-out': tokens.animation.easing.easeOut,
        'ease-in-out': tokens.animation.easing.easeInOut,
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--easing-ease-out)',
        'slide-up': 'slideUp var(--duration-normal) var(--easing-ease-out)',
        'slide-down': 'slideDown var(--duration-normal) var(--easing-ease-out)',
        'scale-in': 'scaleIn var(--duration-fast) var(--easing-ease-out)',
        'bounce-in': 'bounceIn var(--duration-slow) var(--easing-ease-out)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for focus rings
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '@apply livest-focus-ring': {},
        },
        '.focus-ring-inset': {
          '@apply livest-focus-ring-inset': {},
        },
      });
    },
  ],
};