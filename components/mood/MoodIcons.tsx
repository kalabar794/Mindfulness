import React from 'react';
import { MoodRating } from '../../utils/moodTracking';

interface MoodIconProps {
  rating: MoodRating;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: boolean;
}

// Labels for mood ratings
export const MOOD_LABELS: Record<MoodRating, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent'
};

// Colors for mood ratings
export const MOOD_COLORS: Record<MoodRating, string> = {
  1: 'text-red-500',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-green-400',
  5: 'text-emerald-400'
};

// Background colors for mood ratings
export const MOOD_BG_COLORS: Record<MoodRating, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-green-400',
  5: 'bg-emerald-400'
};

// Light background colors for mood ratings
export const MOOD_LIGHT_BG_COLORS: Record<MoodRating, string> = {
  1: 'bg-red-100',
  2: 'bg-orange-100',
  3: 'bg-yellow-100',
  4: 'bg-green-100',
  5: 'bg-emerald-100'
};

export const MoodIcon: React.FC<MoodIconProps> = ({ 
  rating, 
  selected = false, 
  onClick, 
  size = 'md',
  label = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };
  
  const renderIcon = () => {
    switch (rating) {
      case 1:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-3.5 10c-2.61 0-4.83-1.67-5.65-4h11.3c-.82 2.33-3.04 4-5.65 4z" />
          </svg>
        );
      case 2:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-3.501 10c-1.93 0-3.63-1.044-4.549-2.5h9.101c-.921 1.456-2.62 2.5-4.552 2.5z" />
          </svg>
        );
      case 3:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-3.5 6h-1v1h8v-1h-7z" />
          </svg>
        );
      case 4:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-3.501 6c1.93 0 3.63 1.044 4.549 2.5h-9.097c.917-1.456 2.619-2.5 4.548-2.5z" />
          </svg>
        );
      case 5:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-.991 5.142c-.486.447-1.094.708-1.754.708-.654 0-1.261-.256-1.743-.697-.132-.122-.155-.308-.055-.446.196-.271.765-.316.985-.05.489.555 1.493.448 1.576-.222.087-.703-.814-.808-1.276-.809-.451 0-.847-.129-1.155-.387-.305-.261-.478-.621-.478-1.014s.173-.755.478-1.015c.307-.257.704-.387 1.155-.387.427 0 .813.123 1.116.363.302.236.474.546.473.884 0 .319-.165.64-.488.817-.414.236-1.889.069-1.019-.744.583-.539 1.831.246 1.327 1.022-.565.868.291 1.565.931 1.926.511.29.948.166 1.251-.088.33-.276.845-.239.991-.007.106.173.068.376-.119.497z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        flex flex-col items-center space-y-1
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div 
        className={`
          rounded-full flex items-center justify-center
          transition-transform duration-200 
          ${sizeClasses[size]}
          ${selected 
            ? `${MOOD_BG_COLORS[rating]} text-white transform scale-110` 
            : `${MOOD_LIGHT_BG_COLORS[rating]} ${MOOD_COLORS[rating]}`}
          ${onClick ? 'hover:scale-105' : ''}
        `}
        title={MOOD_LABELS[rating]}
      >
        {renderIcon()}
      </div>
      
      {label && (
        <span className={`text-xs font-medium ${MOOD_COLORS[rating]}`}>
          {MOOD_LABELS[rating]}
        </span>
      )}
    </div>
  );
};

export const MoodIconGroup: React.FC<{
  selected: MoodRating | null;
  onSelect: (rating: MoodRating) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}> = ({ selected, onSelect, size = 'md', showLabels = false }) => {
  const ratings: MoodRating[] = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex justify-between gap-2 w-full">
      {ratings.map(rating => (
        <MoodIcon
          key={rating}
          rating={rating}
          selected={selected === rating}
          onClick={() => onSelect(rating)}
          size={size}
          label={showLabels}
        />
      ))}
    </div>
  );
}; 