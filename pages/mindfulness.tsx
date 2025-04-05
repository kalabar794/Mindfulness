import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MindfulnessScene from '../components/MindfulnessScene';
import AudioControls from '../components/AudioControls';
import CompletionScreen from '../components/CompletionScreen';
import SessionTimer from '../utils/sessionTimer';

const MindfulnessSession: React.FC = () => {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(5); // Default 5 minutes
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60);
  const [timer, setTimer] = useState<SessionTimer | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = timer ? 
    ((sessionDuration * 60 - timeRemaining) / (sessionDuration * 60)) * 100 : 0;

  // Start session with selected duration
  const startSession = () => {
    const newTimer = new SessionTimer(
      sessionDuration,
      (remaining) => setTimeRemaining(remaining),
      () => setIsComplete(true)
    );
    setTimer(newTimer);
    newTimer.start();
    setIsActive(true);
    setShowSettings(false);
  };

  // Pause or resume session
  const togglePause = () => {
    if (!timer) return;
    
    if (isActive) {
      timer.pause();
    } else {
      timer.resume();
    }
    setIsActive(!isActive);
  };

  // Reset session
  const resetSession = () => {
    if (timer) {
      timer.reset();
      timer.stop();
    }
    setIsActive(false);
    setShowSettings(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        timer.stop();
      }
    };
  }, [timer]);

  if (isComplete) {
    return <CompletionScreen duration={sessionDuration} />;
  }

  return (
    <>
      <Head>
        <title>Mindfulness Session | Interactive Mindfulness Space</title>
        <meta name="description" content="Focus on your mindfulness practice in this interactive session" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
      </Head>
      
      <div className="relative h-screen">
        {/* Timer overlay */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 z-10">
          <div 
            className="h-full bg-purple-600 transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Timer display */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-80 px-4 py-2 rounded-lg z-10 flex items-center space-x-3">
          <div className="text-xl font-medium">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          
          {!showSettings && (
            <div className="flex space-x-2">
              <button 
                onClick={togglePause}
                className="p-1 rounded-full hover:bg-purple-100"
                aria-label={isActive ? 'Pause' : 'Resume'}
              >
                {isActive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button 
                onClick={resetSession}
                className="p-1 rounded-full hover:bg-purple-100"
                aria-label="Reset session"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Settings overlay */}
        {showSettings && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                Mindfulness Session
              </h2>
              
              <div className="mb-6">
                <label htmlFor="duration" className="block text-gray-700 mb-2">
                  Session Duration (minutes)
                </label>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSessionDuration(Math.max(1, sessionDuration - 1))}
                    className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
                    aria-label="Decrease duration"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                      <path fillRule="evenodd" d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-4xl font-bold text-purple-600 px-4">
                    {sessionDuration}
                  </span>
                  <button 
                    onClick={() => setSessionDuration(Math.min(60, sessionDuration + 1))}
                    className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
                    aria-label="Increase duration"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                      <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <input
                  type="range"
                  id="duration"
                  min="1"
                  max="60"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                  className="w-full h-2 mt-6 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 min</span>
                  <span>15</span>
                  <span>30</span>
                  <span>45</span>
                  <span>60 min</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={startSession}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Begin Session
                </button>
              </div>
            </div>
          </div>
        )}
        
        <MindfulnessScene />
        <AudioControls />
      </div>
    </>
  );
};

export default MindfulnessSession;
