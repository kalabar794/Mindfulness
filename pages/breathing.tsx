import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BreathingVisualizer, { PatternKey, BREATHING_PATTERNS } from '../components/BreathingVisualizer';

const BreathingPage: React.FC = () => {
  const router = useRouter();
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('calm');
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle paused state
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <>
      <Head>
        <title>Guided Breathing | Mindfulness Space</title>
        <meta name="description" content="Practice mindful breathing with guided patterns" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 overflow-hidden relative">
        {/* Top navigation controls */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" />
            </svg>
          </button>
          
          <button 
            onClick={togglePause}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3.22 3.22a.75.75 0 011.06 0l3.97 3.97V4.5a.75.75 0 011.5 0V9a.75.75 0 01-.75.75H4.5a.75.75 0 010-1.5h2.69L3.22 4.28a.75.75 0 010-1.06zm17.56 0a.75.75 0 010 1.06l-3.97 3.97h2.69a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75V4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0zM3.75 15a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-2.69l-3.97 3.97a.75.75 0 01-1.06-1.06l3.97-3.97H4.5a.75.75 0 01-.75-.75zm10.5 0a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-2.69l3.97 3.97a.75.75 0 11-1.06 1.06l-3.97-3.97V19.5a.75.75 0 01-1.5 0V15z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-2.69a.75.75 0 01-.75-.75zm-12 0A.75.75 0 013.75 3h4.5a.75.75 0 010 1.5H5.56l3.97 3.97a.75.75 0 01-1.06 1.06L4.5 5.56v2.69a.75.75 0 01-1.5 0v-4.5zm11.47 11.78a.75.75 0 111.06 1.06l-3.97 3.97h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97zm-4.94-1.06a.75.75 0 010 1.06L5.56 19.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0z" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={toggleControls}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all md:hidden"
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Side panel for breathing pattern controls */}
        <div 
          className={`absolute top-0 right-0 h-full bg-gray-900 bg-opacity-50 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-10 ${
            showControls ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 md:w-72 w-64`}
        >
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6">Breathing Patterns</h2>
            
            <div className="space-y-4 flex-grow overflow-y-auto">
              {Object.entries(BREATHING_PATTERNS).map(([key, pattern]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPattern === key
                      ? 'bg-indigo-600 shadow-lg' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPattern(key as PatternKey)}
                >
                  <h3 className="font-medium text-white">{pattern.name}</h3>
                  <div className="mt-2 text-sm text-gray-300">{pattern.description}</div>
                  
                  {/* Pattern visualization */}
                  <div className="mt-3 flex items-center h-5">
                    {pattern.inhale > 0 && (
                      <div className="h-4 bg-blue-500 rounded" style={{ width: `${pattern.inhale * 10}%` }}></div>
                    )}
                    {pattern.hold1 > 0 && (
                      <div className="h-4 bg-purple-500 rounded" style={{ width: `${pattern.hold1 * 10}%` }}></div>
                    )}
                    {pattern.exhale > 0 && (
                      <div className="h-4 bg-teal-500 rounded" style={{ width: `${pattern.exhale * 10}%` }}></div>
                    )}
                    {pattern.hold2 > 0 && (
                      <div className="h-4 bg-indigo-500 rounded" style={{ width: `${pattern.hold2 * 10}%` }}></div>
                    )}
                  </div>
                  
                  <div className="mt-1 grid grid-cols-4 text-xs text-gray-400">
                    <div>In: {pattern.inhale}s</div>
                    <div>Hold: {pattern.hold1}s</div>
                    <div>Out: {pattern.exhale}s</div>
                    <div>Hold: {pattern.hold2}s</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-300 mb-4">
                Find a comfortable position and breathe along with the animation.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
        
        {/* Main breathing visualization */}
        <div 
          className={`h-screen w-full transition-all duration-300 ${
            showControls ? 'md:mr-72' : 'mr-0'
          }`}
        >
          <BreathingVisualizer 
            selectedPattern={selectedPattern}
            isPaused={isPaused}
          />
        </div>
      </div>
    </>
  );
};

export default BreathingPage; 