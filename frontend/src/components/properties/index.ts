import dynamic from 'next/dynamic';

export { default as FilterSidebar } from './FilterSidebar';
export { default as PropertyCard } from './PropertyCard';
export { default as PropertyGrid } from './PropertyGrid';
export { default as PropertyHeader } from './PropertyHeader';
export { default as PriceFilterBar } from './PriceFilterBar';
export { default as PropertyCategorySelector } from './PropertyCategorySelector';

// MapView must be dynamically imported to avoid SSR issues with Leaflet
export const MapView = dynamic(() => import('./MapView'), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});
