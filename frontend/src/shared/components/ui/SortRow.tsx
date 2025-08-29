import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
    value: string;
    label: string;
}

interface SortRowProps {
    onSortChange?: (sortBy: string) => void;
}

const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'bedrooms', label: 'Most Bedrooms' },
    { value: 'bathrooms', label: 'Most Bathrooms' },
    { value: 'area', label: 'Largest Area' },
];

export const SortRow: React.FC<SortRowProps> = ({ onSortChange }) => {
    const [selectedSort, setSelectedSort] = useState('newest');
    const [isOpen, setIsOpen] = useState(false);

    const handleSortSelect = (value: string) => {
        setSelectedSort(value);
        setIsOpen(false);
        onSortChange?.(value);
    };

    const selectedOption = sortOptions.find(option => option.value === selectedSort);

    return (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>

            <div className="relative">
                <button
                    className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedOption?.label}
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <div className="py-1">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                        selectedSort === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                    }`}
                                    onClick={() => handleSortSelect(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortRow;