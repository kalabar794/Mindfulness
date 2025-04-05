import React from 'react';
import { MoodRating, MOOD_LABELS, MOOD_COLORS } from '../../utils/moodUtils';

interface MoodIconProps {
  rating: MoodRating;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}

const MoodIcon: React.FC<MoodIconProps> = ({ 
  rating, 
  size = 'md', 
  selected = false, 
  onClick,
  showLabel = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };
  
  const label = MOOD_LABELS[rating];
  const color = MOOD_COLORS[rating];
  
  // Get emoji based on rating
  const getEmoji = (rating: MoodRating): string => {
    switch (rating) {
      case 1: return '😔';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '😐';
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-200
          ${selected ? 'shadow-lg scale-110' : 'opacity-70'}
        `}
        style={{ 
          backgroundColor: selected ? color : 'rgba(255, 255, 255, 0.1)',
          border: `2px solid ${color}`,
        }}
      >
        {getEmoji(rating)}
      </div>
      {showLabel && (
        <span className="mt-1 text-xs font-medium text-white text-opacity-90">
          {label}
        </span>
      )}
    </div>
  );
};

interface MoodIconGroupProps {
  selectedMood: MoodRating | null;
  onSelectMood: (rating: MoodRating) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const MoodIconGroup: React.FC<MoodIconGroupProps> = ({ 
  selectedMood, 
  onSelectMood,
  size = 'md',
  showLabels = true
}) => {
  const ratings: MoodRating[] = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex justify-between space-x-2 sm:space-x-4">
      {ratings.map((rating) => (
        <MoodIcon 
          key={rating}
          rating={rating}
          size={size}
          selected={selectedMood === rating}
          onClick={() => onSelectMood(rating)}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
};

export default MoodIcon; 