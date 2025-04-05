import React, { useState, useEffect } from 'react';
import { MoodRating, addMoodEntry } from '../../utils/moodUtils';
import { MoodIconGroup } from './MoodIcon';

interface MoodTrackerProps {
  sessionType: string;
  timing: 'before' | 'after';
  autoPrompt?: boolean;
  onComplete?: () => void;
  existingEntryId?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  sessionType,
  timing,
  autoPrompt = true,
  onComplete,
  existingEntryId
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [note, setNote] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(autoPrompt);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  
  // Reset the state when props change
  useEffect(() => {
    setSelectedMood(null);
    setNote('');
    setIsVisible(autoPrompt);
    setShowThankYou(false);
  }, [sessionType, timing, autoPrompt]);
  
  const handleSaveMood = () => {
    if (selectedMood) {
      const moodData = {
        rating: selectedMood,
        note: note.trim() || undefined
      };
      
      if (timing === 'before') {
        addMoodEntry(sessionType, moodData);
      } else {
        // For 'after', we need to find the most recent entry for this session type
        // and update it with the 'after' mood data
        const recentEntries = addMoodEntry(sessionType, undefined, moodData);
      }
      
      setShowThankYou(true);
      setTimeout(() => {
        setIsVisible(false);
        setShowThankYou(false);
        if (onComplete) onComplete();
      }, 2000);
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };
  
  if (!isVisible) {
    return (
      <button 
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
        onClick={() => setIsVisible(true)}
      >
        How do you feel?
      </button>
    );
  }
  
  if (showThankYou) {
    return (
      <div className="bg-slate-800 bg-opacity-95 backdrop-blur-sm rounded-xl p-6 animate-fadeIn shadow-xl">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">Thank You!</h3>
          <p className="text-white text-opacity-80">Your mood has been recorded.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 bg-opacity-90 backdrop-blur-sm rounded-xl p-6 animate-fadeIn shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-1">
          {timing === 'before' ? 'How are you feeling right now?' : 'How do you feel after your session?'}
        </h3>
        <p className="text-white text-opacity-70">
          Select your current mood
        </p>
      </div>
      
      <div className="mb-6">
        <MoodIconGroup 
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
          size="md"
          showLabels={true}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-white text-opacity-90 mb-1">
          Add a note (optional)
        </label>
        <textarea
          className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={2}
          placeholder="How are you feeling?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between space-x-4">
        <button
          className="flex-1 px-4 py-2 bg-transparent border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          onClick={handleSkip}
        >
          Skip
        </button>
        <button
          className={`
            flex-1 px-4 py-2 rounded-lg font-medium shadow-md transition-colors
            ${selectedMood 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-600 text-slate-300 cursor-not-allowed'}
          `}
          onClick={handleSaveMood}
          disabled={!selectedMood}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MoodTracker; 