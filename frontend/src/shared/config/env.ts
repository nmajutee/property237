// Environment configuration with fallbacks
export const env = {
    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

    // App Configuration
    APP_ENV: import.meta.env.MODE || 'development',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Property237',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Feature Flags
    ENABLE_MAP_VIEW: import.meta.env.VITE_ENABLE_MAP_VIEW === 'true',
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',

    // External Services
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    FLUTTERWAVE_PUBLIC_KEY: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    TRANZAK_PUBLIC_KEY: import.meta.env.VITE_TRANZAK_PUBLIC_KEY,

    // Development helpers
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
    isTest: import.meta.env.MODE === 'test',
} as const;

// Validate required environment variables
const validateEnv = () => {
    const requiredVars = {
        VITE_API_BASE_URL: env.API_BASE_URL,
    };

    const missing = Object.entries(requiredVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0 && env.isProduction) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
};

// Run validation
validateEnv();

export default env;