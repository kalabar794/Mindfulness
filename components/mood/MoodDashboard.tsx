import React, { useState, useEffect } from 'react';
import { getAllMoodEntries, MoodEntry, MoodRating, MOOD_LABELS } from '../../utils/moodUtils';
import { MoodTrendChart, MoodImprovementChart, MoodStats } from './MoodCharts';
import MoodIcon from './MoodIcon';

const MoodDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<number>(7); // Default to 7 days
  const [selectedSessionType, setSelectedSessionType] = useState<string | undefined>(undefined);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [hasMoodEntries, setHasMoodEntries] = useState<boolean>(false);
  
  // Load mood entries and determine available session types
  useEffect(() => {
    const entries = getAllMoodEntries();
    setHasMoodEntries(entries.length > 0);
    
    // Extract unique session types
    const types = [...new Set(entries.map(entry => entry.sessionType))];
    setSessionTypes(types);
    
    // Set default selected type if available
    if (types.length > 0 && !selectedSessionType) {
      setSelectedSessionType(types[0]);
    }
  }, [selectedSessionType]);
  
  // Handle timeframe change
  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
  };
  
  // Handle session type change
  const handleSessionTypeChange = (type: string | undefined) => {
    setSelectedSessionType(type);
  };
  
  // If no mood entries, show empty state
  if (!hasMoodEntries) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-800 bg-opacity-30 rounded-xl p-8">
        <div className="text-4xl mb-4">🧘</div>
        <h3 className="text-xl font-semibold text-white mb-2">No mood data yet</h3>
        <p className="text-white text-opacity-70 text-center max-w-md">
          Complete a mindfulness session to start tracking your mood improvement.
          You'll see charts and statistics here after you record your first mood entry.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Mood Tracking</h2>
          <p className="text-white text-opacity-70">
            Track how mindfulness affects your mood over time
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Timeframe selector */}
          <div className="flex rounded-lg overflow-hidden bg-slate-700 bg-opacity-40">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                className={`px-3 py-2 text-sm font-medium ${
                  timeframe === days
                    ? 'bg-blue-600 text-white'
                    : 'text-white text-opacity-70 hover:bg-slate-600'
                }`}
                onClick={() => handleTimeframeChange(days)}
              >
                {days} days
              </button>
            ))}
          </div>
          
          {/* Session type filter */}
          <div className="flex rounded-lg overflow-hidden bg-slate-700 bg-opacity-40">
            <button
              className={`px-3 py-2 text-sm font-medium ${
                !selectedSessionType
                  ? 'bg-blue-600 text-white'
                  : 'text-white text-opacity-70 hover:bg-slate-600'
              }`}
              onClick={() => handleSessionTypeChange(undefined)}
            >
              All
            </button>
            
            {sessionTypes.map(type => (
              <button
                key={type}
                className={`px-3 py-2 text-sm font-medium ${
                  selectedSessionType === type
                    ? 'bg-blue-600 text-white'
                    : 'text-white text-opacity-70 hover:bg-slate-600'
                }`}
                onClick={() => handleSessionTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <MoodStats 
        days={timeframe} 
        sessionType={selectedSessionType} 
      />
      
      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 bg-opacity-60 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Mood Over Time</h3>
          <MoodTrendChart 
            days={timeframe} 
            sessionType={selectedSessionType}
            showBeforeMood={true}
            showAfterMood={true}
          />
        </div>
        
        <div className="bg-slate-800 bg-opacity-60 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Session Impact</h3>
          <MoodImprovementChart 
            days={timeframe} 
            sessionType={selectedSessionType} 
          />
        </div>
      </div>
      
      {/* Mood legend */}
      <div className="bg-slate-800 bg-opacity-60 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Mood Ratings</h3>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map(rating => (
            <div key={rating} className="flex flex-col items-center">
              <MoodIcon rating={rating as MoodRating} size="sm" showLabel={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard; 