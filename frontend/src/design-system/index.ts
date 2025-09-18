/**
 * Livest Design System
 *
 * Enterprise-grade, modular design system built with accessibility,
 * theming, and developer experience in mind.
 *
 * @author Livest Design Team
 * @version 1.0.0
 */

// Core theme and utilities (Legacy)
export { ThemeProvider, useTheme, useThemeToggle } from './ThemeProvider'
export * from './utils'

// Legacy design tokens
export { default as colors } from './tokens/colors.json'
export { default as typography } from './tokens/typography.json'

// Livest Design System Tokens
export { tokens, theme, getColor, getSpacing, getFontSize, cssVar, a11y } from '../design/tokens';

// Primitive Components
export * from '../components/primitives';

// Theme CSS Variables (imported for side effects)
import '../design/themes/variables.css';

// Re-export commonly used utilities
export type { ClassValue } from 'clsx'