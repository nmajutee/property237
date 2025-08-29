import React from 'react';
import { MapPin } from 'lucide-react';
import type { ViewMode } from '@/shared/types';

interface MapPanelProps {
    viewMode: ViewMode;
}

export const MapPanel: React.FC<MapPanelProps> = ({ viewMode }) => {
    if (viewMode !== 'map') return null;

    return (
        <div className="property237-map-panel">
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MapPin className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                <p className="text-center text-sm">
                    Property map integration coming soon.
                    <br />
                    This will show properties on an interactive map.
                </p>
            </div>
        </div>
    );
};

export default MapPanel;