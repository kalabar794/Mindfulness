import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface CompletionScreenProps {
  duration: number;
  sessionType: string;
  onViewStats?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  duration,
  sessionType = 'Mindfulness Session',
  onViewStats
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState('');

  // Calculate minutes from seconds
  const durationMinutes = Math.round(duration / 60);

  // Collection of mindfulness quotes
  const quotes = [
    "The present moment is the only time over which we have dominion. - Thích Nhất Hạnh",
    "Mindfulness isn't difficult, we just need to remember to do it. - Sharon Salzberg",
    "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor. - Thích Nhất Hạnh",
    "The best way to capture moments is to pay attention. - Jon Kabat-Zinn",
    "Peace comes from within. Do not seek it without. - Buddha",
    "Be happy in the moment, that's enough. Each moment is all we need, not more. - Mother Teresa"
  ];

  // Animation effect on mount
  useEffect(() => {
    // Random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-500 to-blue-600 transition-opacity duration-1000">
      <div className={`max-w-md w-full mx-4 px-6 py-8 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-xl transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-600">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-green-600 mb-3">Session Complete!</h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-600">Session</span>
            <span className="text-lg font-medium">{sessionType}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-600">Duration</span>
            <span className="text-lg font-medium">{durationMinutes} minutes</span>
          </div>
          
          <div className="border-l-4 border-green-300 pl-4 py-2 bg-green-50 italic text-gray-700">
            "{quote}"
          </div>
          
          <p className="text-center text-gray-600">
            Taking time for mindfulness is a gift to yourself. How do you feel now?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => router.push('/')}
            className="px-5 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
          >
            Return Home
          </button>
          
          {onViewStats && (
            <button
              onClick={onViewStats}
              className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              View Mood Stats
            </button>
          )}
          
          <button
            onClick={() => router.push('/mindfulness')}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
