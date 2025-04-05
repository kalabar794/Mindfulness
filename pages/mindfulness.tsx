import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MindfulnessScene from '../components/MindfulnessScene';
import AudioControls from '../components/AudioControls';
import CompletionScreen from '../components/CompletionScreen';
import MoodTracker from '../components/mood/MoodTracker';

const MindfulnessPage: React.FC = () => {
  const router = useRouter();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showBeforeMoodTracker, setShowBeforeMoodTracker] = useState(true);
  const [showAfterMoodTracker, setShowAfterMoodTracker] = useState(false);
  const [moodTracked, setMoodTracked] = useState(false);
  
  const SESSION_TYPE = 'Guided Meditation';
  const SESSION_DURATION = 5 * 60; // 5 minutes in seconds
  
  const handleStartSession = () => {
    setSessionStarted(true);
    setShowBeforeMoodTracker(false);
  };
  
  const handleCompleteSession = () => {
    setSessionCompleted(true);
    setShowAfterMoodTracker(true);
  };
  
  const handleBeforeMoodComplete = () => {
    setShowBeforeMoodTracker(false);
    setMoodTracked(true);
  };
  
  const handleAfterMoodComplete = () => {
    setShowAfterMoodTracker(false);
    setMoodTracked(true);
  };
  
  return (
    <>
      <Head>
        <title>Guided Meditation | Mindfulness Space</title>
        <meta name="description" content="Peaceful visualization with guided meditation and ambient sounds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-600 to-blue-700">
        {/* Header */}
        <header className="pt-6 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Guided Meditation</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all duration-200"
          >
            Back to Home
          </button>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Pre-session mood tracking */}
          {showBeforeMoodTracker && (
            <div className="max-w-md w-full mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Before You Begin</h2>
                <p className="text-white text-opacity-80">
                  Take a moment to check in with yourself
                </p>
              </div>
              <MoodTracker 
                sessionType={SESSION_TYPE} 
                timing="before"
                autoPrompt={true}
                onComplete={handleBeforeMoodComplete}
              />
            </div>
          )}
          
          {/* Session start screen */}
          {!sessionStarted && !showBeforeMoodTracker && (
            <div className="max-w-md w-full mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Ready for Your Session</h2>
                <p className="text-white text-opacity-80">
                  Find a comfortable position and prepare for a {SESSION_DURATION / 60} minute guided meditation
                </p>
              </div>
              <button
                onClick={handleStartSession}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium shadow-lg transition-all duration-200 text-lg"
              >
                Begin Session
              </button>
            </div>
          )}
          
          {/* Active session */}
          {sessionStarted && !sessionCompleted && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-2xl">
                <MindfulnessScene onComplete={handleCompleteSession} duration={SESSION_DURATION} />
                <div className="absolute bottom-4 left-0 right-0 mx-auto w-max">
                  <AudioControls />
                </div>
              </div>
            </div>
          )}
          
          {/* Post-session mood tracking */}
          {showAfterMoodTracker && (
            <div className="max-w-md w-full mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Session Complete</h2>
                <p className="text-white text-opacity-80">
                  How do you feel after your meditation?
                </p>
              </div>
              <MoodTracker 
                sessionType={SESSION_TYPE} 
                timing="after"
                autoPrompt={true}
                onComplete={handleAfterMoodComplete}
              />
            </div>
          )}
          
          {/* Completion screen */}
          {sessionCompleted && !showAfterMoodTracker && (
            <CompletionScreen 
              sessionType={SESSION_TYPE}
              duration={SESSION_DURATION}
              onViewStats={() => router.push('/moods')}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default MindfulnessPage;
