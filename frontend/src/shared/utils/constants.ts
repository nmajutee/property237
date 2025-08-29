// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// App Configuration
export const APP_NAME = 'Property237';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// Property Types
export const PROPERTY_TYPES = {
    CHAMBRE_MODERN: 'chambre_modern',
    STUDIO: 'studio',
    APARTMENT: 'apartment',
    BUNGALOW: 'bungalow',
    VILLA_DUPLEX: 'villa_duplex',
    COMMERCIAL: 'commercial',
    LAND: 'land',
    WAREHOUSE: 'warehouse',
    GUEST_HOUSE: 'guest_house',
} as const;

// Listing Types
export const LISTING_TYPES = {
    RENT: 'rent',
    SALE: 'sale',
    COMMERCIAL: 'commercial',
    GUEST_HOUSE: 'guest_house',
} as const;

// Price Ranges (in XAF)
export const PRICE_RANGES = {
    MIN: 25000,
    MAX: 50000000,
    DEFAULT: 500000,
    STEP: 25000,
};

// Validation Rules
export const VALIDATION_RULES = {
    MIN_TITLE_LENGTH: 10,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 20,
    MAX_DESCRIPTION_LENGTH: 1000,
    MAX_IMAGES: 10,
    MIN_BEDROOMS: 0,
    MAX_BEDROOMS: 20,
    MIN_BATHROOMS: 0,
    MAX_BATHROOMS: 20,
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'property237_auth_token',
    USER_PREFERENCES: 'property237_user_preferences',
    LANGUAGE: 'property237_language',
    THEME: 'property237_theme',
    SEARCH_HISTORY: 'property237_search_history',
} as const;

// Supported Languages
export const LANGUAGES = {
    EN: 'EN',
    FR: 'FR',
} as const;

// Themes
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;