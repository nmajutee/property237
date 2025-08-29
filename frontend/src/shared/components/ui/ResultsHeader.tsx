import React from 'react';
import { List, Map } from 'lucide-react';
import { Button } from './Button';
import type { ViewMode } from '@/shared/types';

interface ResultsHeaderProps {
    resultsCount: number;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
                                                                resultsCount,
                                                                viewMode,
                                                                setViewMode,
                                                            }) => {
    return (
        <div className="property237-results-header">
            <div className="flex justify-between items-center">
        <span className="property237-results-count">
          {resultsCount.toLocaleString()} properties found
        </span>

                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4 mr-2" />
                        List
                    </Button>
                    <Button
                        variant={viewMode === 'map' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                    >
                        <Map className="w-4 h-4 mr-2" />
                        Map
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResultsHeader;