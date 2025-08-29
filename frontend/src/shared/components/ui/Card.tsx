import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden';
    const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '';

    return (
        <div
            className={`${baseClasses} ${interactiveClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;