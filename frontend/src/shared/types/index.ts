// Common API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    results?: T[]; // Backend compatibility
}

// Common UI types
export type ViewMode = 'list' | 'map';
export type Language = 'EN' | 'FR';
export type Theme = 'light' | 'dark';

// Location types
export interface Location {
    id: number;
    name: string;
    region?: string;
}